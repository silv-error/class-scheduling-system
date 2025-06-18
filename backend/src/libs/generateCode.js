const generatedCodes = new Set();
export function generateUniqueCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (generatedCodes.has(code));
  generatedCodes.add(code);
  return code;
}
