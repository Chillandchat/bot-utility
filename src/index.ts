import inquirer from "inquirer";

import signup from "./scripts/signup";

console.log("Welcome to the Chill&chat Bot utility CLI!");

const main = async (): Promise<void> => {
  let authenticated: boolean = false;

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
      if (answer.value === "Create bot account") {
        let username: string, password: string;

        await inquirer
          .prompt({
            name: "value",
            type: "input",
            message: "Username",
          })
          .then((answer: any): void => {
            // TODO: Create condition check if user already exists
            username = answer.value;
          });

        await inquirer
          .prompt({
            name: "value",
            type: "password",
            message: "Set password",
          })
          .then((answer: any): void => {
            // TODO: Create condition to check if the password is 5 =< letters long
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
