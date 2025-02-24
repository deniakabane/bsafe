export function validateNationalId(nationalId) {
  if (!/^\d{16}$/.test(nationalId))
    return "national_id_number must be 16 digits";

  const provinceCode = parseInt(nationalId.substring(0, 2), 10);
  const regencyCode = parseInt(nationalId.substring(2, 4), 10);
  let day = parseInt(nationalId.substring(6, 8), 10);
  const month = parseInt(nationalId.substring(8, 10), 10);
  const year = parseInt(nationalId.substring(10, 12), 10);

  // Validate province code (01 - 34)
  if (provinceCode < 1 || provinceCode > 34) {
    return "Invalid province code in national_id_number";
  }

  // Validate regency code (01 - 99)
  if (regencyCode < 1 || regencyCode > 99) {
    return "Invalid regency code in national_id_number";
  }

  // Adjust for female (DD + 40 rule)
  if (day > 40) day -= 40; // Convert back to actual birth date for validation

  // Validate birth date
  if (day < 1 || day > 31) return "Invalid birth date in national_id_number";
  if (month < 1 || month > 12)
    return "Invalid birth month in national_id_number";

  return null; // ✅ Valid
}
