import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { log, LogType } from '../util/log.util';
import { hash, verify } from 'argon2';
import { email } from '../util/email.util';
import { getUserByID, userExistsID } from '../service';
import { hashEmailCode } from '../util/hashCode.util';

const prisma = new PrismaClient();

// POST :8080s/user
// Create a new user in the database
export const addUser = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;
  const suggestions: boolean = !!req.body.suggestions;

  if (!name || !email || !password) {
    // Gets the variable name of the null value out of `name`, `email`, and `password`
    const nullValue = Object.entries({ name, email, password }).filter(entry => !entry[1])[0][0];
    res.status(400).json({ success: false, error: `Missing parameter ${nullValue}` });

    return;
  }

  try {
    // Check if email already exists in the database 
    const allEmails = await prisma.user.findMany({
      select: {
        email: true
      }
    });
    const similarEmails = await Promise.all(await allEmails.map(async (e) => {
      const similarEmail = await verify(e.email, email);
      return similarEmail;
    }));
    if (similarEmails.includes(true)) {
      res.status(400).json({ success: false, error: `There is already a user under the same email, please choose a different one.` });
      return;
    }

    // Hash email and password with Argon2 https://npmjs.com/package/argon2
    const hashedPassword = await hash(password);
    const hashedEmail = await hash(email);
    const newUser = await prisma.user.create({
      data: { 
        name, 
        email: hashedEmail, 
        password: hashedPassword, 
        suggestions 
      }
    });

    log(LogType.ADDED, "Successfully created user");
    res.status(200).json({ success: true, message: `Successfully signed up as ${name}!`, ...newUser });

    return;
  } catch (err: any) {
    const code: string = err?.code || "";
    // Error gets thrown when a unique field collides
    // Return HTTP status 400 when email or name already exist in database
    if (code === "P2002") {
      res.status(400).json({ success: false, error: `There is already a user under the same name, please choose a different one.` });

      return;
    } else {
      log(LogType.ERROR, `Unsuccessfully created user; request body: ${JSON.stringify(req.body)} error: ${err}`);
      res.status(500).json({ success: false, error: "Something went wrong; please refresh the page and try again, or try again with different credentials" });

      return;
    }
  }
}

// POST :8080/users/sendVerificationEmail
// Send a verification email to user
export const sendVerificationEmail = async (req: Request, res: Response) => {
  const userEmail = req.body?.email;
  if (!userEmail) {
    res.status(400).json({ success: false, error: "Please supply an email." });
    return;
  }

  const exists = await userExistsID(req.body?.id || "");
  if (exists) {
    const user = await getUserByID(req.body?.id || "");
    const hexUsername = Buffer.from(user.name, "utf8").toString("hex");
    const hexCode = Buffer.from(hashEmailCode(userEmail).join("_"), "utf8").toString("hex");
    try {

      const emailRes = await email({
        to: userEmail,
        subject: "Verify your email for ScrapBook",
        html: `
          <h1>Verify your email for ScrapBook</h1>
          <h3>To get started and use the full potential of ScrapBook, verify your email address you signed up with! (${userEmail})</h4>
          <br/>
          <a href="http://localhost:3000/verification-email/verify?u=${hexUsername}&c=${hexCode}">Click this link to verify your email!</a>
        `
      });
      
      log(LogType.SUCCESS, `Successfully sent verification email. Info: ${emailRes}`);
      res.status(200).json({ success: true, message: "Verification email sent" });
    } catch (err) {
      res.status(500).json({ success: false, error: err });
    }
  }
}