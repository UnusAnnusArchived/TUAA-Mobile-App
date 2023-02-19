import PocketBase from "pocketbase";
import { userAtom } from "./atoms";
import RecoilAuthStore from "./authStore";
import { pb } from "./endpoints";

const pocketbase = new PocketBase(pb, new RecoilAuthStore(userAtom));

pocketbase.autoCancellation(false);

export default pocketbase;
