import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { type NextApiRequest, type NextApiResponse } from "next";
import { fromString } from "uint8arrays/from-string";
import { compose } from "@/fragments";
import { env } from "../../env";

const { SECRET_KEY } = env;

interface Request extends NextApiRequest {
  body: {
    err?: unknown;
    recipient: string;
    latitude?: number;
    longitude?: number;
    timestamp: string;
    jwt: string;
  };
}

export default async function createCredential(
  req: Request,
  res: NextApiResponse,
) {
  try {
    if (SECRET_KEY) {
      // create and authenticate new DID instance
      const key = fromString(SECRET_KEY, "base16");
      const provider = new Ed25519Provider(key);
      const staticDid = new DID({
        resolver: KeyResolver.getResolver(),
        provider,
      });
      await staticDid.authenticate();
      compose.setDID(staticDid);
      const data = await compose.executeQuery<{
        createWalletEvent: {
          document: {
            id: string;
            recipient: string;
            latitude: number;
            longitude: number;
            timestamp: string;
          };
        };
      }>(`
        mutation{
            createWalletEvent(input: {
            content: {
                recipient: "${req.body.recipient}"
                latitude: ${req.body.latitude ?? 0}
                longitude: ${req.body.longitude ?? 0}
                timestamp: "${req.body.timestamp}"
            }
            })
            {
            document{
                id
                recipient
                latitude
                longitude
                timestamp
            }
          }
        }
     `);
      console.log(data);
      if (data.data?.createWalletEvent) {
        const completeBadge = data.data.createWalletEvent.document;
        return res.json(completeBadge);
      }
      return res.json({
        err: "Error creating wallet event",
      });
    } else {
      return res.json({
        err: "Missing unique key",
      });
    }
  } catch (err) {
    res.json({
      err,
    });
  }
}
