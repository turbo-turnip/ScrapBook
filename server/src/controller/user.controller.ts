import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { log, LogType } from '../util/log.util';
import { hash, verify } from 'argon2';
import { email } from '../util/email.util';
import { userExists, getUser, authenticateUser } from '../service';
import { hashEmailCode } from '../util/hashCode.util';

const prisma = new PrismaClient();

// POST :8080/user
// Create a new user in the database
export const addUser = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;
  const suggestions: boolean = !!req.body.suggestions;
  const interests: Array<string> = req.body.interests;

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
        suggestions,
        // Temporary, fix default value bug later - See README.md Bugs
        avatar: "/default-avatar.svg",
        bot: {
          create: {
            rank: "Silver",
            attachments: { create: [] }
          }
        },
        // Create interests and add them to user if they don't already exist in the interest table
        interests: {
          connectOrCreate: interests.map(interest => ({ create: { name: interest }, where: { name: interest } }))
        }
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

  const exists = await userExists("id", req.body?.id || "");
  if (exists) {
    const user = await getUser("id", req.body?.id || "");
    const hexUsername = Buffer.from(user.name, "utf8").toString("hex");
    const hexCode = Buffer.from(hashEmailCode(user.email).join("_"), "utf8").toString("hex");

    // fun times with database137

    try {

      const emailRes = await email({
        to: userEmail,
        subject: "Verify your email for ScrapBook",
        html: `
          <h1>Verify your email for ScrapBook</h1>
          <h4>To get started and use the full potential of ScrapBook, verify your email address you signed up with! (${userEmail})</h4>
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

// POST :8080/users/verify
// Verify a user's email
export const verifyUser = async (req: Request, res: Response) => {
  const exists = await getUser("name", req.body?.username || "");
  if (!exists) {
    res.status(400).json({ success: false, error: "Invalid username" });
    return;
  } else if (exists && exists.verified) {
    res.status(304).json({ success: true, message: "You're already verified" });
    return;
  } 

  // Check if password is correct
  const passwordCorrect = await verify(exists.password, req.body?.password || "");
  if (!passwordCorrect) {
    res.status(403).json({ success: false, error: "Invalid password" });
    return;
  }
  
  // Check if email matches the email hash code
  const validEmail = hashEmailCode(exists.email).join('_') === req.body?.code;
  if (!validEmail) {
    res.status(403).json({ success: false, error: "Invalid verification code" });
    return;
  }

  try {
    // Verify user by updating verified field in user table
    await prisma.user.update({
      where: { id: exists.id },
      data: { verified: true }
    });

    res.status(200).json({ success: true, message: "Successfully verified user" });
  } catch (err: any) {
    log(LogType.ERROR, err);
    res.status(500).json({ success: false, error: "An error occurred. Please refresh the page" });
  }
}


// POST :8080/users/find
// Returns a specific user based on their name
export const findUser = async (req: Request, res: Response) => {
  const exists = await getUser("name", req.body?.username || "");
  if (!exists) {
    res.status(400).json({ success: false, error: "Invalid username" });
    return;
  }

  res.status(200).json({ success: true, user: exists });
}

// POST :8080/users/rename
export const renameUser = async (req: Request, res: Response) => {
  const accessToken = req.body?.accessToken || "";
  const refreshToken = req.body?.refreshToken || "";
  const username = req.body?.name || "";
  const password = req.body?.password || "";

  const usernameAlreadyExists = await prisma.user.findFirst({
    where: {
      name: username
    },
    select: { id: true }
  });

  if ((usernameAlreadyExists || {})?.id) {
    res.status(400).json({ success: false, error: "That username already exists, please try a different one ☹️" });
    return;
  }

  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  try {
    const passwordCorrect = await verify(response.account.password, password);
    if (!passwordCorrect) {
      res.status(403).json({ success: false, error: "Invalid password" });
      return;
    }

    await prisma.user.update({
      where: { id: response.account.id },
      data: {
        name: username
      }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: response.account.id },
      include: {
        interests: true,
        blockedUsers: true,
        communities: true,
        posts: true,
        followers: true,
        friends: true,
        messages: true,
        openDMs: true,
        bot: {
          include: {
            attachments: true
          }
        },
        folders: {
          include: {
            posts: true
          }
        }
      }
    })

    res.status(200).json({ success: true, message: "Successfully verified user", updatedUser, ...response });
  } catch (err: any) {
    log(LogType.ERROR, err);
    res.status(500).json({ success: false, error: "An error occurred. Please refresh the page" });
  }
}