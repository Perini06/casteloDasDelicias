import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Valida se a string fornecida é um e-mail no formato básico.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email.trim());
}

/**
 * Valida se a string fornecida é um CPF brasileiro válido.
 * @param {string} value  — pode conter pontos e hífen.
 * @returns {boolean}
 */
export function validateCPF(value) {
  const digits = value.replace(/\D/g, '');
  return cpfValidator.isValid(digits);
}

/**
 * Aplica máscara de CPF conforme digitação.
 * @param {string} value  — apenas dígitos ou dígitos + pontuação.
 * @returns {string} — no formato 000.000.000-00
 */
export function maskCPF(value) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  let result = nums
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  return result;
}

/**
 * Aplica máscara de telefone brasileiro conforme digitação.
 * @param {string} value — apenas dígitos ou já formatado.
 * @returns {string} — no formato (99) 99999-9999
 */
export function maskPhone(value) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length > 10) {
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  } else if (nums.length > 6) {
    return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
  } else if (nums.length > 2) {
    return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
  }
  return nums;
}

/**
 * Valida se o telefone fornecido é válido no padrão brasileiro.
 * @param {string} value — string já mascarada ou não.
 * @returns {boolean}
 */
export function validatePhone(value) {
  const phoneObj = parsePhoneNumberFromString(value, 'BR');
  return phoneObj ? phoneObj.isValid() : false;
}
