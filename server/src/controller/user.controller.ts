import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { log, LogType } from '../util/log.util';

const prisma = new PrismaClient();

// POST :8080/user
// Create a new user in the database
export const addUser = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  if (!name || !email || !password) {
    // Gets the variable name of the null value out of `name`, `email`, and `password`
    const nullValue = Object.entries({ name, email, password }).filter(entry => !entry[1])[0][0];
    res.status(400).json({ success: false, error: `Missing parameter ${nullValue}` });

    return;
  }

  try { 
    const newUser = await prisma.user.create({
      data: { name, email, password }
    });

    log(LogType.ADDED, "Successfully created user");
    res.status(200).json(newUser);

    return;
  } catch (err: any) {
    const code: string = err?.code || "";
    // Error gets thrown when a unique field collides
    // Return HTTP status 400 when email or name already exist in database
    if (code === "P2002") {
      const similarKey = err.meta.target.split(/user_|_key/g)[1];
      res.status(400).json({ success: false, error: `There is already a user under the same ${similarKey}, please choose a different one.` });

      return;
    } else {
      log(LogType.ERROR, `Unsuccessfully created user; request body: ${JSON.stringify(req.body)}`);
      res.status(500).json({ success: false, error: "Something went wrong; please refresh the page and try again, or try again with different credentials" });

      return;
    }
  }
}