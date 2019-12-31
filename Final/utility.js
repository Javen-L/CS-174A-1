// Utility functions and structures for the variable geese project



/***** FUNCTIONS **************/
// Written by: Betto Cerrillos
// Checks to see if a ray has intersected an AABB
// ray is the structure that describes the ray to test
//      {origin: Vector3 for the origin of this ray, direction: Normalized direction of ray}
// aabb is the structure that describes the aabb box for the thing to be tested
//      {mid: Vector3 for midpoint of AABB, d: Array of size 3 that has the halflengths for x,y,z}
// model_transform is the transform of the object we are testing for intersection.
// intersect_point is the output variable assuming it is an object with a vector3
// Returns true if there is an intersection, false otherwise
function check_ray_intersect_AABB(ray, aabb, model_transform, intersect_point )
{
  // Move the ray to the object coordinates to easily test intersection
  let inverse_matrix = Mat4.inverse(model_transform);
  let inverse_matrix_vec = model_transform.transposed();
  let ray_origin = inverse_matrix.times(ray.origin.to4(1)).to3();
  let ray_direction = inverse_matrix_vec.times(ray.direction.to4(0)).to3();
  ray_direction.normalize();

  // Calculate the intersection points between each pair of planes parallel in
  // the x-axis, y-axis, and z-axis. The t value is where along the ray the intercept
  // ocurred. By finding the minumum t and max t, we get a line segment to test to see
  // if it is inside the box.
  let tmin = Number.NEGATIVE_INFINITY,
    tmax = Number.POSITIVE_INFINITY;
  for (let i = 0; i < 3; i++)
  {
    // Initialize all the plane variables for this axis
    let plane1_point = Vec.of(0,0,0);
    let plane2_point = Vec.of(0,0,0);
    plane1_point[i] = aabb.mid[i] + aabb.d[i];
    plane2_point[i] = aabb.mid[i] - aabb.d[i];
    let plane1_normal = Vec.of(0,0,0);
    let plane2_normal = Vec.of(0,0,0);
    plane1_normal[i] = 1;
    plane2_normal[i] = -1;

    // If the ray is perpendicular to the plane, then there is no intersection
    if (Math.abs(ray_direction.dot(plane1_normal)) < Number.EPSILON) continue;
    // ray plane intersection
    let t0 =
      plane1_point.minus(ray_origin).dot(plane1_normal) / ray_direction.dot(plane1_normal);
    let t1 =
      plane2_point.minus(ray_origin).dot(plane2_normal) / ray_direction.dot(plane2_normal);
    // t0 must always be the smallest one
    if (t0 > t1)
    {
      let tmp = t0;
      t0 = t1;
      t1 = tmp;
    }

    // Find the overall tmin and tmax
    tmin = Math.max(tmin, t0);
    tmax = Math.min(tmax, t1);
    // If the minumum t is greater than max, then it fails
    if (tmin > tmax) return false;
  }

  // Calculate the midpoint, which should be inside the AABB.
  let p1 = ray_origin.plus(ray_direction.times(tmin));
  let p2 = ray_origin.plus(ray_direction.times(tmax));
  let mid = p1.plus(p2).times(0.5);
  if (
    aabb.mid[0] + aabb.d[0] > mid[0] &&  // x-coords
    aabb.mid[0] - aabb.d[0] < mid[0] &&
    aabb.mid[1] + aabb.d[1] > mid[1] &&  // y-coords
    aabb.mid[1] - aabb.d[1] < mid[1] &&
    aabb.mid[2] + aabb.d[2] > mid[2] &&  // z-coords
    aabb.mid[2] - aabb.d[2] < mid[2] )
    {
      intersect_point.point = Vec.of(0,0,0);
      intersect_point.point = intersect_point.point.plus(p1);
      return true;
    }
  return false;
}

// plane: {mid_point: Vec3 (in obj space), normal: Vec3 d: [dx, dy]}
// returns true if hit
function check_ray_intersect_plane(ray, plane, model_transform, intersect_point)
{
  let inverse_matrix = Mat4.inverse(model_transform);
  let inverse_matrix_vec = inverse_matrix.transposed();
  let ray_origin = inverse_matrix.times(ray.origin.to4(1.0)).to3();
  let ray_direction = inverse_matrix_vec.times(ray.direction.to4(0.0)).to3().normalized();
  // let scale_factors = calculate_scale_factor(model_transform);
  // let plane_d = Vec.of(plane.d[0] * scale_factors[0], plane.d[1] * scale_factors[1]);
  // If the ray is perpendicular to the plane, then there is no intersection
  if (Math.abs(ray_direction.dot(plane.normal)) < Number.EPSILON) return false;
  // ray plane intersection
  let t =
    plane.mid_point.minus(ray_origin).dot(plane.normal) / ray_direction.dot(plane.normal);
  let int_p = ray_direction.times(t).plus(ray_origin);
  if (int_p[0] < plane.mid_point[0] + plane.d[0] &&
      int_p[0] > plane.mid_point[0] - plane.d[0] &&
      int_p[1] < plane.mid_point[1] + plane.d[1] &&
      int_p[1] > plane.mid_point[1] - plane.d[1]) {
    intersect_point.point = ray_direction.times(t).plus(ray_origin);
    intersect_point.point = model_transform.times(intersect_point.point.to4(1)).to3();
    return true;
  }
  return false;
}

// Assumes all of the menu items came from a 2x2 square
function check_mouse_click_menu_item(event, camera_transform, projection_matrix, menu_transform, canvas)
{
  const mouse_position = ( e, rect = canvas.getBoundingClientRect() ) => 
    Vec.of( 2 * e.clientX / (rect.right - rect.left) - 1, 1 - 2 * e.clientY / (rect.bottom - rect.top) );
  let to_clip_from_world = projection_matrix * camera_transform;
  let x_max = to_clip_from_world.times(Mat4.translation([1,0,0])),
      x_min = to_clip_from_world.times(Mat4.translation([-1,0,0])),
      y_max = to_clip_from_world.times(Mat4.translation([0,1,0])),
      y_min = to_clip_from_world.times(Mat4.translation([0,-1,0]));
   return false;
}

// plane -> {mid_point: Vec3, normal: Vec3, dx: Vec3, dy: Vec3 }, these are in model coordinates
function check_ray_intersect_plane_2(ray, plane, model_transform, intersect_point)
{
  let plane_normal = model_transform.times(plane.normal.to4(0)).to3();
  let dx = model_transform.times(plane.dx.to4(0.0)).to3();
  let dy = model_transform.times(plane.dy.to4(0.0)).to3();
  let plane_point = model_transform.times(plane.mid_point.to4(1.0)).to3();
  // Calculate the intersection poitn on the plane
  // If the ray is perpendicular to the plane, then there is no intersection
  if (Math.abs(ray.direction.dot(plane_normal)) < Number.EPSILON) return false;
  let t =
    plane_point.minus(ray.origin).dot(plane_normal) / ray.direction.dot(plane_normal);
  if (t < 0.0) return false;
  let intersection = ray.direction.times(t).plus(ray.origin);
  // Project onto the width and height vector and make sure that it is within the rect.
  let plane_vector = intersection.minus(plane_point);
  let width = dx.norm(), height = dy.norm();
  let proj_vec_to_width = plane_vector.dot(dx) / width;
  let proj_vec_to_height = plane_vector.dot(dy) / height;
  // There is only an intersection if the projection lies within the width and height values
  if (Math.abs(proj_vec_to_height) < height && Math.abs(proj_vec_to_width) < width)
  {
    intersect_point.point = intersection;
    return true;
  }
  return false;
}

// Calculates ray from the camera origin to where in the screen the user has clicked;
function calculate_click_ray(event, camera_transform, projection_matrix, canvas,) {
  const mouse_position = ( e, rect = canvas.getBoundingClientRect() ) => 
    Vec.of( 2 * e.clientX / (rect.right - rect.left) - 1, 1 - 2 * e.clientY / (rect.bottom - rect.top) ); 
  let mouse_pos = mouse_position(event);
  // Convert from screen to clip coordinates
  const ray_clip = Vec.of(mouse_pos[0], mouse_pos[1], -1.0, 1.0);
  // Inverse the ray into the eye space.
  let ray_eye = Mat4.inverse(projection_matrix).times(ray_clip);
  // Treat it as a vector now
  ray_eye = Vec.of(ray_eye[0], ray_eye[1], -0.1, 0.0);
  // Bring it to world coordinates
  let ray_world = camera_transform.transposed().times(ray_eye).to3();
  // Calculate eye location
  let eye_loc = Mat4.inverse(camera_transform).times(Vec.of(0,0,0,1)).to3(); 
  return {origin: eye_loc, direction: ray_world.normalized()};
}

// Calculates ray from the position in screen space in terms of world space coordinates, towards that direction.
// Gotten from: https://stackoverflow.com/questions/20140711/picking-in-3d-with-ray-tracing-using-ninevehgl-or-opengl-i-phone/20143963#20143963
// Returns a ray object -> {origin: Vec3, direction: Vec3 }
function calculate_click_ray_2(event, camera_transform, projection_matrix, canvas) {
  const mouse_position = ( e, rect = canvas.getBoundingClientRect() ) => 
    Vec.of( 2 * e.clientX / (rect.right - rect.left) - 1, 1 - 2 * e.clientY / (rect.bottom - rect.top) ); 
  let mouse_pos = mouse_position(event);
  // Since it is in NDC, we create to points from the near to far plane (which are mapped from -1 to 1)
  let near_pos = Vec.of(mouse_pos[0], mouse_pos[1], -1.0, 1.0);
  let far_pos = Vec.of(mouse_pos[0], mouse_pos[1], 1.0, 1.0);
  let to_world_from_clip = Mat4.inverse(projection_matrix.times(camera_transform));
  near_pos = to_world_from_clip.times(near_pos);
  far_pos = to_world_from_clip.times(far_pos);
  // Perspective divide since these are points
  near_pos = near_pos.times(1.0 / near_pos[3]);
  far_pos = far_pos.times(1.0 / far_pos[3]);
  return {origin: near_pos.to3(), direction: (far_pos.minus(near_pos)).normalized().to3()};
}

// Takes in the camera matrix and repositions it some distance from the value
// in a smoothed out way. Camera will look down the -x axis.
// Returns an object with the new camera transform, and a boolean to indicate
// if the animation is done.
// This function is generally called until it finished and moves on to the battle
// scene.
function move_camera_matrix_to_pos(camera_transform, target_location, frame, max_frames)
{
  const target_local_transform =
    Mat4.translation([target_location[0], target_location[1], target_location[2]] ).times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
  let target_transform = Mat4.inverse(target_local_transform);
  target_transform = target_transform.map( (x, i) => Vec.from(camera_transform[i] ).mix(x, frame / max_frames));
  return target_transform;
}

// Find the world position of the model transform matrix.
function calculate_world_position(model_transform)
{
  // Columns 1-3 with rows 1-3 form the basis vectors (in terms of world coordinates)
  // so scaling these vectors by their translations in the 4th column gives the world coordinates.
  let world_pos = Vec.of(0,0,0);
  for (let i = 0; i < 3; i++)
  {
    let tmp = Vec.of(model_transform[0][i], model_transform[1][i], model_transform[2][i]).normalized();
    tmp.scale(model_transform[i][3]);
    world_pos = world_pos.plus(tmp); 
  }
  return world_pos;
}

function calculate_scale_factor(model_transform) {
  let scale_factors = Vec.of(1,1,1);
  for (let i = 0; i < 3; i++) {
    scale_factors[i] = Vec.of(model_transform[0][i], model_transform[1][i], model_transform[2][i]).norm();
  }
  return scale_factors;
}

// Generates the positions for the tiles for movement and attack
function generate_attack_tile_locations(goose_stat, current_tile_x, current_tile_z, width, length)
{
  let attack_range = goose_stat.attack_range;
  let attack_positions = [];
  let attack_tiles = [];
  for (let i = -1 * attack_range; i <= attack_range; i++){
    for (let j = -1 * attack_range; j <= attack_range; j++) {
        if (i == 0 && j == 0 ) continue;
        let manhattan_distance = Math.abs(i) + Math.abs(j);
        let next_tile_x = current_tile_x + i;
        let next_tile_z = current_tile_z + j;
        if (next_tile_x < 0 || next_tile_x > 19 ||
            next_tile_z < 0 || next_tile_z > 19) continue; // Don't draw outside the map
        if (manhattan_distance <= attack_range) {
          attack_positions.push(calculate_world_pos_from_tile(next_tile_x, next_tile_z, width, length));
          attack_tiles.push([next_tile_x, next_tile_z]);
        }
    }
  }
  // Generate the maximum attack range tiles
  return {tiles: attack_tiles, positions: attack_positions};
}

function generate_move_tiles_locations(input_goose, move_positions, curPath, cellToPath, range, obstacles, geese, current_tile_x, current_tile_z, width, length) {
  if (range == 0)
    return;

  if (current_tile_x < 0 || current_tile_x >= 20 || current_tile_z < 0 || current_tile_z >= 20)
    return;

  if (obstacles[obstacles.length - current_tile_z - 1][current_tile_x] == 1)
    return;

  for (let g_index in geese) {
    let goose = geese[g_index];
    if (goose.stats.goose_id == input_goose.stats.goose_id)
      continue;
    if (current_tile_x == goose.tile_position.x && current_tile_z == goose.tile_position.z)
      return;
  }
  
  if (input_goose.tile_position.x != current_tile_x || input_goose.tile_position.z != current_tile_z) {
    move_positions.push(calculate_world_pos_from_tile(current_tile_x, current_tile_z, width, length));
    if (current_tile_x + " " + current_tile_z in cellToPath) {
      if (curPath.length < cellToPath[current_tile_x + " " + current_tile_z].length) {
        cellToPath[current_tile_x + " " + current_tile_z] = curPath;
      }
    }
    else {
      cellToPath[current_tile_x + " " + current_tile_z] = curPath;
    }
  }
  if (curPath[curPath.length-1] != 'L')
    generate_move_tiles_locations(input_goose, move_positions, curPath + 'R', cellToPath, range-1, obstacles, geese, current_tile_x+1, current_tile_z, width, length);
  if (curPath[curPath.length-1] != 'R')
    generate_move_tiles_locations(input_goose, move_positions, curPath + 'L', cellToPath, range-1, obstacles, geese, current_tile_x-1, current_tile_z, width, length);
  if (curPath[curPath.length-1] != 'D')
    generate_move_tiles_locations(input_goose, move_positions, curPath + 'U', cellToPath, range-1, obstacles, geese, current_tile_x, current_tile_z+1, width, length);
  if (curPath[curPath.length-1] != 'U')
    generate_move_tiles_locations(input_goose, move_positions, curPath + 'D', cellToPath, range-1, obstacles, geese, current_tile_x, current_tile_z-1, width, length);
}

// Calculate the world position of an object originally at position (0,0,0)
// to the center of the tile denoted by num_tile_x, num_tile_z, with a tile
// length and width (Note: num_tile_x/z starts from 0 );
function calculate_world_pos_from_tile(num_tile_x, num_tile_z, width, length)
{
  let posx = width * num_tile_x + (width / 2.0);
  let posz = length * num_tile_z + (length / 2.0);
  return Vec.of(posx, 0, -posz);
}

// These are functions that are used for camera animations, zoom in and out
// and also keep state
class Camera_Animations_Manager {
  constructor() {
    this.original_camera_transform = undefined;
    this.battle_camera_transform = undefined;
    this.frame = 0.0;
    this.zoom_in_max_frames = 60;
    this.zoom_out_max_frames = 60;
    this.animating = false;
    this.animation_type = 0;
    this.turn = '';
  }

  // 1 = zoom in
  // 2 = zoom out
  change_animation(animation_type, original_camera_transform = undefined, battle_camera_transform = undefined ) {
    this.animation_type = animation_type;
  }

  play_animation() {
    if (this.animation_type == 1) {
      return this.play_zoom_in();
    } else if (this.animation_type == 2) {
      return this.play_zoom_out();
    }
  }

  // Sets the battle camera transform to look at the certain location from
  // a certain distance, looking towards the camera_look_vector direction
  // (assume normalized) and on xz plane
  set_battle_camera_location(target_location, camera_look_vector, distance) {
    let rotation_matrix = Quaternion.fromBetweenVectors([0,0,1], camera_look_vector).toMatrix4(true);
    let result = Mat4.translation([target_location[0], target_location[1], target_location[2]] ).times(Mat.of(rotation_matrix[0], rotation_matrix[1], rotation_matrix[2], rotation_matrix[3]));
    this.battle_camera_transform = Mat4.inverse(result);
    this.battle_camera_position = target_location; //.plus(camera_look_vector.times(distance));
    this.battle_camera_rotation = Quaternion.fromBetweenVectors([0,0,1], camera_look_vector);
  }

  set_original_camera_transform(camera_transform) {
    this.original_camera_transform = camera_transform;
    let inv = Mat4.inverse(camera_transform);
    this.original_camera_position = inv.times(Vec.of(0,0,0,1)).to3();
    let view_vector = inv.times(Vec.of(0,0,-1,0)).to3();
    if (this.turn == 'red')
      this.original_camera_rotation = Quaternion.fromBetweenVectors([0,0,-1], view_vector );
    else 
      this.original_camera_rotation = Quaternion.fromBetweenVectors(view_vector, [0,0,1] );
    // this.original_camera_rotation = this.original_camera_rotation.add(Quaternion.fromBetweenVectors([1,0,-1], [1,0,1]));
  }

  // Plays the camera zoom in animation until it is done. returns the current matrix
  // when it is done. May also return true if it is in an incorrect state.
  // original_camera_transform must be set.
  // battle_camera_transform must be set.
  // When it finishes, it keeps the original camera location
  play_zoom_in() {
    if (this.original_camera_transform && this.battle_camera_transform) {
      this.animating = true;
      this.frame += 1.0;
      if (this.frame > this.zoom_in_max_frames) {
        this.frame = 0.0;
        let result = this.battle_camera_transform;
        this.battle_camera_transform = undefined;
        this.animating = false; 
        this.animation_type = 0;
        return result;
      }
      // return this.battle_camera_transform.map( (x, i) => Vec.from(this.original_camera_transform[i] ).mix(x, this.frame / this.zoom_in_max_frames));
      let new_position = this.original_camera_position.mix(this.battle_camera_position, this.frame / this.zoom_in_max_frames);
      let slerp_func = this.original_camera_rotation.slerp(this.battle_camera_rotation);

      const camera_anim_pct = this.frame / this.zoom_out_max_frames;
      let new_rotation = slerp_func(this.frame / this.zoom_in_max_frames);
      let rot_matrix4 = new_rotation.toMatrix4(true);
      let rotation_matrix = Mat.of(rot_matrix4[0], rot_matrix4[1], rot_matrix4[2], rot_matrix4[3]);
      if (this.turn == 'blue') {
        let rot_add_on = Mat4.rotation((1.0 - camera_anim_pct) * Math.PI, Vec.of(0,1,0));
        rotation_matrix = rot_add_on.times(rotation_matrix);
      }
      let new_transform = Mat4.translation([new_position[0], new_position[1], new_position[2]]).times(rotation_matrix); 
      return Mat4.inverse(new_transform);
    }
  }

  // Plays the camera zoom out animation until it is done. Returns the current
  // camera matrix this frame. When it finishes, it sets this.animating to false.
  play_zoom_out() {
    if (this.original_camera_transform && this.battle_camera_transform) {
      this.animating = true;
      this.frame += 1.0;
      if (this.frame > this.zoom_out_max_frames) {
        this.frame = 0.0;
        let result = this.original_camera_transform;
        this.original_camera_transform = undefined;
        this.battle_camera_transform = undefined;
        this.animating = false;
        this.animation_type = 0;
        return result;
      }
      // return this.original_camera_transform.map( (x, i) => Vec.from(this.battle_camera_transform[i] ).mix(x, this.frame / this.zoom_out_max_frames));
      let new_position = this.battle_camera_position.mix(this.original_camera_position, this.frame / this.zoom_out_max_frames);
      const camera_anim_pct = this.frame / this.zoom_out_max_frames;
      let slerp_func = this.battle_camera_rotation.slerp(this.original_camera_rotation);

      let new_rotation = slerp_func(this.frame / this.zoom_in_max_frames);
      let rot_matrix4 = new_rotation.toMatrix4(true);
      let rotation_matrix = Mat.of(rot_matrix4[0], rot_matrix4[1], rot_matrix4[2], rot_matrix4[3]);
      if (this.turn == 'blue') {
        let rot_add_on = Mat4.rotation(camera_anim_pct * Math.PI, Vec.of(0,1,0));
        rotation_matrix = rot_add_on.times(rotation_matrix);
      }
      let new_transform = Mat4.translation([new_position[0], new_position[1], new_position[2]]).times(rotation_matrix); 
      return Mat4.inverse(new_transform);
    }
  }
}

// Draws menu items with text and handles the user clicking on these items
// Can be enabled or disabled by modifying .enabled.
class Menu_Manager
{
  // menus is a list of objects in this format:
  // -> { menu_transform: Mat4, tag: string, menu_material: material, text: string, clickable: boolean}
  //  menu_transform is the transform of the menu item, tag is the unique name of this menu item (keeping track on the caller's end)
  //  menu_material -> associated material with menu , clickable -> true if this item can be clicked on
  //  text -> string containing text on item if needed (undefined otherwise), text_transform -> transform for text;
  // we will only use one shape for the menu (squares).
  constructor(menus, menu_shape, text_shape, text_material)
  {
    this.enabled = true;  // This is to quickly enable/disable the menus
    this.menu_shape = menu_shape;
    this.text_shape = text_shape;
    this.text_material = text_material;
    this.menus = {};
    this.menus_length = 0;
    this.clickable_items = [];
    for(let item in menus) {
      this.add_menu(menus[item]);
    }
  }

  // all : boolean -> if set to true, clears all menu items
  // item_tags : array of strings -> if all is false, then clear items with these tags
  clear_menus(all, item_tags)
  {
    if (all)
    {
      this.menus = {};
      this.clickable_items = [];
    }
    this.menus_length = 0;
  }

  // add a menu to be handled
  // if it fails, returns false
  add_menu(menu)
  {
    this.menus[menu.tag] = {obj_transform: menu.menu_transform, material: menu.menu_material, text: menu.text, text_transform: menu.text_transform, world_transform: undefined};
    if (menu.clickable)
    {
      this.clickable_items.push(menu.tag);
    }
    this.menus_length+=1;
    return true;
  }

  // Update the world transforms of all menu items.
  // Must be called before check_collisions is called in a frame, and before draw_menus is called
  update_transforms(camera_transform)
  {
    const inverse = Mat4.inverse(camera_transform);
    for (let item in this.menus)
    {
      this.menus[item].world_transform = inverse.times(this.menus[item].obj_transform);
    }
  }

  update_menu_transform(tag, menu_transform)
  {
    menu.obj_transform = menu_transform;
  }

  // If there are any items being clicked with this ray, returns a list of tags
  // otherwise returns an empty list.
  check_collisions(ray)
  {
    if (!this.enabled) return [];
    let clicked_on_tags = [];
    // Since we are assuming everything is a square, we can use one collision body for all menu items
    const plane_collision = {mid_point: Vec.of(0,0,0), normal: Vec.of(0,0,1), dx: Vec.of(1,0,0), dy: Vec.of(0,1,0)};
    for(let tag_i in this.clickable_items)
    {
      let menu = this.menus[this.clickable_items[tag_i]];
      if (check_ray_intersect_plane_2(ray, plane_collision, menu.world_transform, {point: undefined}))
      {
        clicked_on_tags.push(this.clickable_items[tag_i]);
      }
    }
    return clicked_on_tags;
  }

  draw_menus(graphics_state, context)
  {
    if (!this.enabled) return;
    for(let item_id in this.menus)
    {
      let item = this.menus[item_id];
      if (item.material)
        this.menu_shape.draw(graphics_state, item.world_transform, item.material);
      if (item.text)
      {
        this.text_shape.set_string(item.text, context);
        this.text_shape.draw(graphics_state, item.world_transform.times(item.text_transform), this.text_material);
      }
    }
  }
}