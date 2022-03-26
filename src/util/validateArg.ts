export const usernameValidation = (username: string) => {
  const usernameRegExp = /^[a-zA-Z0-9_]*$/;
  if (!username.match(usernameRegExp)) {
    return false;
  }
  return true;
};

export const voitterUsernameValidation = (username: string) => {
  const usernameRegExp = /^[a-zA-Z0-9_]*$/;
  if (!username.match(usernameRegExp)) {
    return false;
  }
  return true;
};

export const passwordValidation = (password: string) => {
  const passwordRegExp = /^[a-zA-Z0-9@#,]*$/;
  if (!password.match(passwordRegExp)) {
    return false;
  }
  return true;
};

export const untilIdValidation = (untilId: string) => {
  const untilIdRegExp = /^[0-9]*$/;
  if (!untilId.match(untilIdRegExp)) {
    return false;
  }
  return true;
};
