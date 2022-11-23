import { RENDER_UNIT, STUDS } from "./model/Unit"

export const THETA = String.fromCodePoint(120579);
export const DEGREES = String.fromCharCode(176);
export const A = 0;
export const B = 1;
export const C = 2;
export const SIDES = [A, B, C];
export const BRICK_WIDTH_MM = 7.91;
export const STUD_WIDTH_MM = 4.91;
export const STUD_HEIGHT_MM = 1.75;
export const STUD_RADIUS = RENDER_UNIT.from(STUD_WIDTH_MM / (2 * BRICK_WIDTH_MM), STUDS);
export const STUD_HEIGHT = RENDER_UNIT.from(STUD_HEIGHT_MM / BRICK_WIDTH_MM, STUDS);
export const BRICK_STROKE_WIDTH = RENDER_UNIT.from(1 / 20, STUDS);
export const BRICK_COLOR = "orange";
export const BRICK_STROKE_COLOR = "black";
export const VERTEX_COLOR = "red";
export const VERTEX_STROKE_SCALE = 3;
export const ZOOM_MINIMUM_WIDTH = 600;
export const TRIPLE_GROUPS_PER_PAGE = 2;
export const MAX_MENU_ITEM_LENGTH = 30;