import { works } from "../../data/works";
import { findWorkById } from "../../utils/works";

export function resolveWorkRoute(id?: string) {
  return id ? findWorkById(works, id) : undefined;
}
