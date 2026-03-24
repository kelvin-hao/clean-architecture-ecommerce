import crypto from 'crypto'

export function generateSKUCode(spuId: string, variationValues: { name: string; value: string }[]): string {
  const variationString = variationValues.map((v) => v.value).join('-')

  const hash = crypto
    .createHash('md5')
    .update(spuId + variationString)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase()

  return `SKU-${hash}`
}
