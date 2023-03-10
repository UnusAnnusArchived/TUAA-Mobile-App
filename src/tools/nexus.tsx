// Code from https://github.com/luisanton-io/recoil-nexus; modified because code wasn't working, might be a react-native issue or the code is just broken

import { RecoilValue, RecoilState, useRecoilCallback } from "recoil";

interface Nexus {
  get?: <T>(atom: RecoilValue<T>) => T;
  getPromise?: <T>(atom: RecoilValue<T>) => Promise<T>;
  set?: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
  reset?: (atom: RecoilState<any>) => void;
}

const nexus: Nexus = {};

const RecoilNexus: React.FC<React.PropsWithChildren> = ({ children }) => {
  nexus.get = useRecoilCallback<[atom: RecoilValue<any>], any>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getLoadable(atom).contents;
      },
    []
  );

  nexus.getPromise = useRecoilCallback<[atom: RecoilValue<any>], Promise<any>>(
    ({ snapshot }) =>
      function <T>(atom: RecoilValue<T>) {
        return snapshot.getPromise(atom);
      },
    []
  );

  //@ts-ignore idk why but types aren't working right
  nexus.set = useRecoilCallback(({ transact_UNSTABLE }) => {
    return function <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
      transact_UNSTABLE(({ set }) => {
        set(atom, valOrUpdater);
      });
    };
  }, []);

  nexus.reset = useRecoilCallback(({ reset }) => reset, []);

  return <>{children}</>;
};

export default RecoilNexus;

export function getRecoil<T>(atom: RecoilValue<T>): T {
  return nexus.get!(atom);
}

export function getRecoilPromise<T>(atom: RecoilValue<T>): Promise<T> {
  return nexus.getPromise!(atom);
}

export function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
  nexus.set!(atom, valOrUpdater);
}

export function resetRecoil(atom: RecoilState<any>) {
  nexus.reset!(atom);
}
