import { works } from "../../data/works";
import { filterWorks } from "../../utils/works";

export function getVisibleWorks(filter: string) {
  return filterWorks(works, filter);
}
