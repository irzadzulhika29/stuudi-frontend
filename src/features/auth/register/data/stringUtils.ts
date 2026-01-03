export const maskEmail = (email: string) => {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length < 2) return email;

  const name = parts[0];
  const domain = parts[1];
  const domainParts = domain.split(".");
  const ext = domainParts[domainParts.length - 1];

  return `${name[0]}*********@${domain[0]}****.${ext}`;
};
