import inquirer from "inquirer";

import { AuthType } from "./scripts";
import getUser from "./scripts/getUser";
import login from "./scripts/login";
import signup from "./scripts/signup";
import updateDescription from "./scripts/updateDescription";

const main = async (): Promise<void> => {
  console.clear();

  console.log("Welcome to the Chill&chat Bot utility CLI!");

  await inquirer
    .prompt([
      {
        name: "value",
        type: "list",
        message: "Please select a option to continue...",
        choices: ["Login", "Create bot account", "Exit"],
      },
    ])
    .then(async (answer: any): Promise<void> => {
      if (answer.value === "Login") {
        let username: string, password: string;

        await inquirer
          .prompt({
            name: "value",
            type: "input",
            message: "Username",
          })
          .then((answer: any): void => {
            username = answer.value;
          });

        await inquirer
          .prompt({
            name: "value",
            type: "password",
            message: "Password",
          })
          .then((answer: any): void => {
            password = answer.value;
          });

        // @ts-ignore
        await login(username, password)
          .then(async (): Promise<void> => {
            await getUser(username)
              .then(async (user: AuthType | {}): Promise<void> => {
                // @ts-ignore
                if (!user.bot) {
                  console.error(
                    "Error: Cannot login to normal user account, please login to a bot account."
                  );
                  process.exit(1);
                }
                console.clear();

                console.log(
                  // @ts-ignore
                  `Welcome! you are now logged in as ${user?.username}.`
                );

                await inquirer
                  .prompt({
                    name: "value",
                    type: "list",
                    message: "Please select a option to continue...",
                    choices: ["Update description"],
                  })
                  .then(async (answer: any): Promise<void> => {
                    if (answer.value === "Update description") {
                      await inquirer
                        .prompt({
                          name: "value",
                          type: "input",
                          message: "Please enter the description of you bot:",
                        })
                        .then(async (answer: any): Promise<void> => {
                          // @ts-ignore
                          updateDescription(user.username, answer.value)
                            .then(() => {
                              console.log(
                                "Description has been updated successfully!"
                              );
                              process.exit(0);
                            })
                            .catch((err: unknown): void => {
                              console.error(err);
                              process.exit(1);
                            });
                        });
                    }
                  });
              })
              .catch((err: unknown): void => {
                console.error(err);
                process.exit(1);
              });
          })
          .catch((_err: unknown): void => {
            console.error("Password or username is invalid!!");
            process.exit(1);
          });
      }
      if (answer.value === "Create bot account") {
        let username: string, password: string;

        await inquirer
          .prompt({
            name: "value",
            type: "input",
            message: "Username",
          })
          .then(async (answer: any): Promise<void> => {
            await getUser(answer.value)
              .then((user: AuthType | {}): void => {
                if (Object.keys(user).length !== 0) {
                  console.error(
                    "Error: User already exists! Please pick a different a username."
                  );
                  process.exit(1);
                }
                username = answer.value;
              })
              .catch((err: unknown): void => {
                console.log(err);
                process.exit(1);
              });
          });

        await inquirer
          .prompt({
            name: "value",
            type: "password",
            message: "Set password",
          })
          .then((answer: any): void => {
            if (answer.value.length > 5) {
              console.error(
                "Error: Password must be more than 5 letters long."
              );
              process.exit(1);
            }

            password = answer.value;
          });

        await inquirer
          .prompt({
            name: "value",
            type: "password",
            message: "Confirm password",
          })
          .then((answer: any): void => {
            if (password !== answer.value) {
              console.error("Error: Passwords does not match.");
              process.exit(1);
            }
          });

        // @ts-ignore
        await signup(username, password).then((): void => {
          console.log("Bot registration success.");
          process.exit(0);
        });
      }
    });
};

main();
