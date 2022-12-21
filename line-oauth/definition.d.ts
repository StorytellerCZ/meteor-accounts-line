declare module 'storyteller:line-oauth' {}

declare global {
  interface Line {
    retrieveCredential(credentialToken: string, credentialSecret: string): void
  }
}
