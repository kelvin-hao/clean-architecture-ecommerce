/**
 * Defines the structure for a single, parsed frame of a stack trace.
 */
export interface StackFrame {
  functionName: string
  file: string
  line: number
  column: number
  isInternal: boolean // True if the frame is from node_modules
}

/**
 * Defines the structure for the fully formatted error object.
 */
export interface FormattedError {
  errorMessage: string
  origin: StackFrame | null // The first frame from your application code
}

/**
 * Parses a raw Node.js stack trace string into a structured object.
 *
 * @param stackTraceString The raw .stack property from an Error object.
 * @returns A structured FormattedError object, or null if parsing fails.
 */
export function formatStackTrace(stackTraceString: string | null): FormattedError | null {
  if (!stackTraceString) {
    return null
  }

  const lines = stackTraceString.trim().split('\n')
  const errorMessage = lines.shift()?.replace('Error: ', '').trim() || 'Unknown Error'

  const stackFrameRegex = /^\s*at\s*(?:(.*)\s+\()?(.*?):(\d+):(\d+)\)?$/

  const stack: StackFrame[] = lines
    .map((line) => {
      const match = line.match(stackFrameRegex)
      if (!match) {
        return null
      }

      const [, functionName, file, lineStr, columnStr] = match

      return {
        functionName: functionName || 'anonymous',
        file,
        line: parseInt(lineStr, 10),
        column: parseInt(columnStr, 10),
        isInternal: file.includes('node_modules')
      }
    })
    .filter((frame): frame is StackFrame => frame !== null)

  const origin = stack.find((frame) => !frame.isInternal) || null

  return {
    errorMessage,
    origin
  }
}
