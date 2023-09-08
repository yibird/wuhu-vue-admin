import {HttpCodeEnum} from '/@/enums/httpEnum'
import {Result} from "/#/axios";

const {
    CONTINUE,
    OK,
    CREATED,
    MULTIPLE_CHOICES,
    MOVED_PERMANENTLY,
    MOVED_TEMPORARILY,
    SEE_OTHER,
    NOT_MODIFIED
} = HttpCodeEnum;

type Key = UnionToIntersection<keyof typeof HttpCodeEnum>;
const statusMap: Record<Key, Result> = {
    "CONTINUE": {
        code: CONTINUE,
        message: "asdad",
        data: []
    }
}