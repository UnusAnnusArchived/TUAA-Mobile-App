import PocketBase from "pocketbase";
import { userAtom } from "./atoms";
import RecoilAuthStore from "./authStore";
import { pb } from "./endpoints";

//@ts-ignore
const pocketbase = new PocketBase(pb, new RecoilAuthStore(userAtom));

pocketbase.autoCancellation(false);

(async () => {
  await pocketbase.collection("users").authRefresh();
})();

export default pocketbase;
