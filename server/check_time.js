const token = "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zNWJ1SHRFdktyWHB1MTB6bVRsdUZYMDAyOUEiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NjQ2NzEyMDQsImZ2YSI6WzgsLTFdLCJpYXQiOjE3NjQ2NzExNDQsImlzcyI6Imh0dHBzOi8vYWJzb2x1dGUtb3Bvc3N1bS01NS5jbGVyay5hY2NvdW50cy5kZXYiLCJuYmYiOjE3NjQ2NzExMzQsInNpZCI6InNlc3NfMzZIanU4bHBFczBSaEpidzEwVVQ4Q0Y5VjF6Iiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8zNWJ4QUxCblZLMjBKVmRBb1ZsZFBCM3VPRzIiLCJ2IjoyfQ.BrSIRNOsN06u-8IjkT_fp4sRLXxDxxMhE5CzmXPrNL96g_EMUnGhROgOUn2MEN9zFVQ6M0IGZRnGsV5bDhbEM4ZVuhru4QIe_N5fhPbmLNbBbekFGaLPpoKqqnphfQi5j9URsW_EcvXCYG75C0zQ9IKyiXDr6cj44Vg2S_o5nt9ifMAdSVPPp16YIEi-n8_fI80mTGaQf0l8m1uo3kFYuBefuZGiJ71Q-HtCcefpVwATg3eSJm535gmCOzvsBXUjQna55drbdtyE_Knv4FykzJL_7HKT6ngmFbPV8zUW9f4TuuQZyZdOIwrqe_cddEoVI-cP-zVO07h5O8bEmGK5Kg";

const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));

console.log("Token Expiration (exp):", payload.exp);
console.log("Token Issued At (iat):", payload.iat);
console.log("Current System Time (sec):", Math.floor(Date.now() / 1000));

const diff = Math.floor(Date.now() / 1000) - payload.exp;
console.log("Difference (Current - Exp):", diff, "seconds");

if (diff > 0) {
    console.log("Token is EXPIRED by", diff, "seconds");
} else {
    console.log("Token is VALID for another", -diff, "seconds");
}

console.log("System Time String:", new Date().toString());
console.log("Token Exp Time String:", new Date(payload.exp * 1000).toString());
