const MEMORY_SIZE_FACTOR: number = 1024

/**
 * An object representing memory sizes in different units.
 * Units include bytes (B), kilobytes (KB), megabytes (MB), gigabytes (GB), and terabytes (TB).
 * Use the getter methods to obtain values in various units.
 *
 * @constant
 * @type {Object}
 * @property {number} B - The size in bytes.
 * @property {number} KB - The size in kilobytes.
 * @property {number} MB - The size in megabytes.
 * @property {number} GB - The size in gigabytes.
 * @property {number} TB - The size in terabytes.
 */
export const MEMORY_SIZE = Object.freeze({
  get B() { return 1 },
  get KB() { return this.B * MEMORY_SIZE_FACTOR },
  get MB() { return this.KB * MEMORY_SIZE_FACTOR },
  get GB() { return this.MB * MEMORY_SIZE_FACTOR },
  get TB() { return this.GB * MEMORY_SIZE_FACTOR },
})
