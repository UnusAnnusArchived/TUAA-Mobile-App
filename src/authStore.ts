import { Admin, BaseAuthStore, Record } from "pocketbase";
import { RecoilState } from "recoil";
import { getRecoil, resetRecoil, setRecoil } from "./tools/nexus";
import { IUserAtom } from "./types";

export default class RecoilAuthStore extends BaseAuthStore {
  userAtom: RecoilState<IUserAtom>;

  constructor(atom: RecoilState<IUserAtom>) {
    super();

    this.userAtom = atom;
  }

  /** @inheritdoc */
  get token(): string {
    const data = this._getUserAtom() || {};

    return data.token || "";
  }

  /** @inheritdoc */
  get model(): Record | Admin | null {
    const data = this._getUserAtom() || {};
    console.log(data);

    if (data === null || typeof data !== "object" || data.model === null || typeof data.model !== "object") {
      return null;
    }

    if (typeof data.model?.collectionId === "undefined") {
      return new Admin(data.model);
    }

    return new Record(data.model);
  }

  /**  @inheritdoc */
  save(token: string, model: Record | Admin | null) {
    this._setUserAtom({ token, model });

    super.save(token, model);
  }

  /** @inheritdoc */
  clear() {
    this._resetUserAtom();

    super.clear();
  }

  /** Fetches user atom */
  private _getUserAtom() {
    return getRecoil(this.userAtom);
  }

  /** Sets user atom */
  private _setUserAtom(value: IUserAtom) {
    return setRecoil(this.userAtom, value);
  }

  /** Resets user atom to default value */
  private _resetUserAtom() {
    return resetRecoil(this.userAtom);
  }
}
