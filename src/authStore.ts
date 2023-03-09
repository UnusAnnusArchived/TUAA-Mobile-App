import { BaseAuthStore, Record } from "pocketbase";
import { RecoilState } from "recoil";
import { getRecoil, resetRecoil, setRecoil } from "./tools/nexus";
import { IUser, IUserAtom } from "./types";

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
  //@ts-ignore
  get model(): IUser | null {
    const data = this._getUserAtom() || {};

    if (data === null || typeof data !== "object" || data.model === null || typeof data.model !== "object") {
      return null;
    }

    return data.model;
  }

  /**  @inheritdoc */
  //@ts-ignore
  save(token: string, model: IUser | null) {
    this._setUserAtom({ token, model });

    super.save(token, model as Record | null);
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
