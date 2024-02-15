export class AuthRequiredError extends Error {
  subheading: string;

  constructor(
    heading = "Authentication required to access this page",
    subheading = ""
  ) {
    super(heading);
    this.name = "AuthRequiredError";
    this.subheading = subheading;
  }
}
