// Manages the scene for a battle between two geese in the world
// and applies the proper animation when they attack
class Battle_Scene_Manager {
    constructor() {
        this.battle_ongoing = false;
    }

    // Sets the states for calling a menu transform
    // Assumes the menu manager and camera manager have been setup.
    initiate_battle_sequence(attacking_goose, defending_goose, menu_manager, camera_manager, turn) {
        this.menu_manager = menu_manager;
        this.camera_manager = camera_manager;
        this.atk_goose = attacking_goose;
        this.def_goose = defending_goose;
        this.actions = []; // Contains ids for what type of animation is going to be played
        this.battle_ongoing = true;
        this.move_animation = false; // Used to keep track of the move animation
        this.menu_tags = [];
        this.final_scaling_factor = 0.3;
        this.generate_battle_results();  // Queue up the results of the battle
        this.turn = turn;
        // State variables
        this.queued_action = {goose: attacking_goose, action: "camera zoom in", distance_offset: this.atk_goose.distance_offset};
        this.animation_state = {
            damage_icon: {
                init: false,
                translation: Mat4.identity(),
                rotation: Quaternion.fromBetweenVectors([0,0,-1], [0,0,-1]),
            },
        }
    }

    animate_battle(graphics_state, context) {
        if (!this.queued_action) {
            // Pull the next action in queue if no action is queued
            this.queued_action = this.actions.shift();
        }
        let camera_transform = graphics_state.camera_transform;

        if (this.queued_action.action == "attack") {
            this.queued_action.goose.state.animating = true;

            for (let shape in this.queued_action.goose.shapes) {
                if (this.queued_action.goose.colors[shape] == 'pink') {
                    this.queued_action.goose.colors[shape] = 'white';
                }
            }

            this.queued_action.goose.attack();
            // Check to see if during this animation step, there should be a damage done
            if (this.queued_action.goose.state.inflict_damage_other && !this.animation_state.damage_icon.init){
                // Spawn a new manager icon only once
                  // -> { menu_transform: Mat4, tag: string, menu_material: material, text: string, clickable: boolean}
                // let position = calculate_world_pos_from_tile(this.queued_action.goose.tile_position.x, this.queued_action.goose.tile_position.z, 10, 10).plus(Vec.of(0,10,0));
                // let position = this.queued_action.other_goose.transforms['body_' + this.queued_action.other_goose.constructor.name + this.queued_action.other_goose.stats.goose_id].times(Vec.of(0,0,0,1)).plus(Vec.of(0,10,0,1)).to3();
                let position = Vec.of(0,0,0).plus(calculate_world_pos_from_tile(this.queued_action.other_goose.tile_position.x, this.queued_action.other_goose.tile_position.z, 10, 10)).plus(Vec.of(0, 3, 0));
                // Add offset if the goose taking damage is the attacking goose
                if (this.atk_goose == this.queued_action.other_goose) {
                    position = position.plus(this.vector_from_atk_to_def.times(this.atk_goose.stop_distance));
                }
                this.animation_state.damage_icon.translation = Mat4.translation([position[0], position[1], position[2]]).times(Mat4.scale([1, 1, 1]));
                this.animation_state.damage_icon.init = true;

                this.queued_action.other_goose.stats.health -= (this.queued_action.goose.stats.attack - this.queued_action.other_goose.stats.defense);
               
                for (let shape in this.queued_action.other_goose.shapes) {
                    if (this.queued_action.other_goose.colors[shape] == 'white') {
                        this.queued_action.other_goose.colors[shape] = 'pink';
                    }
                }    
            } 
            if (this.queued_action.goose.state.animating == false) {
                this.queued_action = undefined;
                this.animation_state.damage_icon.init = false;
                // this.menu_manager.clear_menus(true, {});
            }
        } else if (this.queued_action.action == "dead") {
            this.queued_action = undefined;
        } else if (this.queued_action.action == "camera zoom in") {
            // Initial setup
            if (!this.camera_manager.animating) {
                let distance_offset = this.queued_action.distance_offset;
                const height_offset = 2;
                this.camera_manager.turn = this.turn;
                this.camera_manager.change_animation(1);
                this.camera_manager.set_original_camera_transform(camera_transform);

                // Setup the goose rotations to face each other in battle
                // Special case for diagonals
                this.atk_goose_old_orientation = this.atk_goose.state.orientation;
                this.def_goose_old_orientation = this.def_goose.state.orientation;
                let camera_look_vector = Vec.of(0,0,1); // Defines the look vector in terms of the camera (assume looks at +z).
                // Check distance in 2D for how to orient them
                let face_direction =
                    [this.def_goose.tile_position.x - this.atk_goose.tile_position.x,
                     this.def_goose.tile_position.z - this.atk_goose.tile_position.z];
                // Check diagonals first
                if (face_direction[0] > 0 && face_direction[1] > 0) {
                    // Attacking goose looks Top right
                    this.atk_goose_new_orientation = 0.5;
                    this.def_goose_new_orientation = 2.5;
                    // Camera faces +x -z
                    camera_look_vector = Vec.of(1,0,1).normalized();
                } else if (face_direction[0] < 0 && face_direction[1] > 0) {
                    // Attacking goose looks Top Left
                    this.atk_goose_new_orientation = 1.5;
                    this.def_goose_new_orientation = 3.5;
                    // Camera faces -x -z
                    camera_look_vector = Vec.of(-1,0,1).normalized();   
                } else if (face_direction[0] < 0 && face_direction[1] < 0) {
                    // Attacking goose looks Bottom Left
                    this.atk_goose_new_orientation = 2.5;
                    this.def_goose_new_orientation = 0.5;
                    // Camera faces -x -z
                    camera_look_vector = Vec.of(1,0,1).normalized();   
                } else if (face_direction[0] > 0 && face_direction[1] < 0) {
                    // Attacking goose looks Bottom right
                    this.atk_goose_new_orientation = 3.5;
                    this.def_goose_new_orientation = 1.5;
                    // Camera faces +x -z
                    camera_look_vector = Vec.of(-1,0,1).normalized();   
                } // Manhattan directions
                 else if (face_direction[0] < 0) {
                    // Attacking goose looks Left
                    this.atk_goose_new_orientation = 2;
                    this.def_goose_new_orientation = 0;
                    // Camera faces -z
                    camera_look_vector = Vec.of(0,0,1).normalized();   
                } else if (face_direction[0] > 0) {
                    // Attacking goose looks Right
                    this.atk_goose_new_orientation = 0;
                    this.def_goose_new_orientation = 2;
                    // Camera faces towards -z
                    camera_look_vector = Vec.of(0,0,1).normalized();   
                } else if (face_direction[1] < 0) {
                    // Attacking goose looks down
                    this.atk_goose_new_orientation = 3;
                    this.def_goose_new_orientation = 1;
                    // Camera faces towards -x
                    camera_look_vector = Vec.of(1,0,0).normalized();   
                } else if (face_direction[1] > 0) {
                    // Attacking goose looks up
                    this.atk_goose_new_orientation = 1;
                    this.def_goose_new_orientation = 3 ;
                    // Camera faces towards -x
                    camera_look_vector = Vec.of(1,0,0).normalized();   
                }

                // The location should be the midpoint between the two goose locations
                let atk_goose_world_pos = calculate_world_pos_from_tile(this.atk_goose.tile_position.x, this.atk_goose.tile_position.z, 10, 10);
                let def_goose_world_pos = calculate_world_pos_from_tile(this.def_goose.tile_position.x, this.def_goose.tile_position.z, 10, 10);
                let position_offset = camera_look_vector.times(distance_offset).plus(Vec.of(0,height_offset,0));
                let midpoint = atk_goose_world_pos.plus(def_goose_world_pos).times(0.5).plus(position_offset);
                this.vector_from_atk_to_def = def_goose_world_pos.minus(atk_goose_world_pos);
                this.camera_manager.set_battle_camera_location (midpoint, camera_look_vector, 30);
            }
            this.camera_manager.animating = true;
            // Linearly scale the geese down to a size.
            let camera_animation_fraction = this.camera_manager.frame / this.camera_manager.zoom_in_max_frames;
            let current_scale = Vec.of(1).mix(Vec.of(this.final_scaling_factor), camera_animation_fraction);
            this.atk_goose.temp_scale_transform = Mat4.scale([current_scale[0], current_scale[0], current_scale[0]]);
            this.def_goose.temp_scale_transform = Mat4.scale([current_scale[0], current_scale[0], current_scale[0]]);

            camera_transform = this.camera_manager.play_animation();
            // Linearly rotate the goose into their positions
            this.atk_goose.lerp_rotate_goose(this.atk_goose_old_orientation, this.atk_goose_new_orientation, this.camera_manager.zoom_in_max_frames);
            this.def_goose.lerp_rotate_goose(this.def_goose_old_orientation, this.def_goose_new_orientation, this.camera_manager.zoom_in_max_frames);
            if (!this.camera_manager.animating ) {
                this.queued_action = undefined;
                this.atk_goose.state.orientation = this.atk_goose_new_orientation;
                this.def_goose.state.orientation = this.def_goose_new_orientation;
            }
        } else if (this.queued_action.action == "camera zoom out") {
            for (let shape in this.queued_action.goose.shapes) {
                if (this.queued_action.goose.colors[shape] == 'pink') {
                    this.queued_action.goose.colors[shape] = 'white';
                }
            }
            for (let shape in this.queued_action.other_goose.shapes) {
                if (this.queued_action.other_goose.colors[shape] == 'pink') {
                    this.queued_action.other_goose.colors[shape] = 'white';
                }
            }
            // Initial setup
            if (!this.camera_manager.animating) {
                this.camera_manager.change_animation(2);
                this.camera_manager.battle_camera_transform = camera_transform;

                // update orientations
                // linearly rotate the goose to the nearest manhattan direction (left, right, up, down)
                this.atk_goose_old_orientation = this.atk_goose.state.orientation;
                this.def_goose_old_orientation = this.def_goose.state.orientation;
                this.atk_goose_new_orientation = Math.ceil(this.atk_goose.state.orientation) % 4;
                this.def_goose_new_orientation = Math.ceil(this.def_goose.state.orientation) % 4;
            }
            this.camera_manager.animating = true;
            let move_animation_fraction = this.frameNumber / this.move_max_frames;
            
            // Move the goose back
            let translation = this.vector_from_atk_to_def.times((1.0 - move_animation_fraction) * this.queued_action.goose.stop_distance);
            this.queued_action.goose.temp_translation_transform = Mat4.translation([translation[0], translation[1], translation[2]]);

            // Linearly scale the geese down to a size.
            let current_scale = Vec.of(this.final_scaling_factor).mix(Vec.of(1), this.camera_manager.frame / this.camera_manager.zoom_in_max_frames);
            this.atk_goose.temp_scale_transform = Mat4.scale([current_scale[0], current_scale[0], current_scale[0]]);
            this.def_goose.temp_scale_transform = Mat4.scale([current_scale[0], current_scale[0], current_scale[0]]);

            camera_transform = this.camera_manager.play_animation();
            // Linearly rotate the goose into their positions
            this.atk_goose.lerp_rotate_goose(this.atk_goose_old_orientation, this.atk_goose_new_orientation, this.camera_manager.zoom_in_max_frames);
            this.def_goose.lerp_rotate_goose(this.def_goose_old_orientation, this.def_goose_new_orientation, this.camera_manager.zoom_in_max_frames);
            if (!this.camera_manager.animating ) {
                this.queued_action = undefined;
                this.atk_goose.state.orientation = this.atk_goose_new_orientation;
                this.def_goose.state.orientation = this.def_goose_new_orientation;
            }
        } else if (this.queued_action.action == "move") {
            let camera_pos = Mat4.inverse(camera_transform).times(Vec.of(0,0,0,1)).to3();
            // Move the goose near the other goose
            let atk_goose_world_pos = calculate_world_pos_from_tile(this.queued_action.goose.tile_position.x, this.queued_action.goose.tile_position.z, 10, 10);
            let def_goose_world_pos = calculate_world_pos_from_tile(this.queued_action.other_goose.tile_position.x, this.queued_action.other_goose.tile_position.z, 10, 10);
            let vertical_offset = Vec.of(0,2,0);
            this.vector_from_atk_to_def = def_goose_world_pos.minus(atk_goose_world_pos);

            if (!this.move_animation) {
                // Setup the parameters
                this.frameNumber = 0;
                this.move_max_frames = this.queued_action.duration;
                this.move_animation = true;
                this.initial_offset_vector = atk_goose_world_pos.plus(vertical_offset).minus(camera_pos).normalized().times(5);
                this.initial_camera_pos = atk_goose_world_pos.plus(vertical_offset).minus(this.initial_offset_vector);
                this.final_camera_pos = camera_pos;  
                let final_camera_look_at_pos = atk_goose_world_pos.plus(vertical_offset).plus(this.vector_from_atk_to_def.times(0.5 * (1.0 - this.queued_action.goose.stop_distance) + this.queued_action.goose.stop_distance));
                this.final_offset_vector = final_camera_look_at_pos.minus(this.final_camera_pos);

                // Create quaternions for rotations
                let initial_quaternion = Quaternion.fromBetweenVectors([0,0,-1], this.initial_offset_vector);
                let final_quaternion = Quaternion.fromBetweenVectors([0,0,-1], this.final_offset_vector);
                this.slerp_move_camera = initial_quaternion.slerp(final_quaternion); 
            }
            let move_animation_fraction = this.frameNumber / this.move_max_frames;

            let translation = this.vector_from_atk_to_def.times(move_animation_fraction * this.queued_action.goose.stop_distance);
            this.queued_action.goose.temp_translation_transform = Mat4.translation([translation[0], translation[1], translation[2]]);

            // Move the camera
            let current_position_camera = this.initial_camera_pos.mix(this.final_camera_pos, move_animation_fraction);
            let current_rotation_camera = this.slerp_move_camera(move_animation_fraction);
            let new_crc = current_rotation_camera.toMatrix4(true);
            camera_transform =
                Mat4.inverse(
                    Mat4.translation([current_position_camera[0], current_position_camera[1], current_position_camera[2]]).times(
                        Mat4.of(new_crc[0], new_crc[1], new_crc[2], new_crc[3])
                )); 

            this.frameNumber++;
            if (this.frameNumber > this.move_max_frames) {
                this.move_animation = false;
                this.queued_action = undefined;
            }
        }

        // Render damage icons
        if (this.animation_state.damage_icon.init) {
            // this.menu_manager.update_transforms(camera_transform);
            // this.menu_manager.draw_menus(graphics_state, context);
            // Calculate vector from current position to the sun
            let pos = this.animation_state.damage_icon.translation.times(Vec.of(0,0,0,1)).to3();
            let camera_pos = Mat4.inverse(camera_transform).times(Vec.of(0,0,0,1)).to3();
            let vector_from_pos_to_camera = camera_pos.minus(pos);
            let camera_offset = vector_from_pos_to_camera.normalized().times(-5);
            this.animation_state.damage_icon.rotation = Quaternion.fromBetweenVectors([0,0,1], vector_from_pos_to_camera);

            // Render the damage icon
            let render_shape = this.menu_manager.text_shape;
            let render_material = this.menu_manager.text_material;
            let rotation_matrix = this.animation_state.damage_icon.rotation.toMatrix4(true);
            let camera_offset_transform = Mat4.translation([camera_offset[0], camera_offset[1], camera_offset[2]]);
            let render_transform = camera_offset_transform.times(this.animation_state.damage_icon.translation.times(Mat4.of(rotation_matrix[0], rotation_matrix[1], rotation_matrix[2], rotation_matrix[3])));
            render_shape.set_string((this.atk_goose.stats.attack - this.def_goose.stats.defense).toString(), context);
            render_shape.draw(graphics_state, render_transform, render_material);
        }
        // If nothing is left in queue, then it is done
        if (!this.queued_action && this.actions.length == 0) {
            this.battle_ongoing = false;
        }
        return camera_transform;
    }

    // For battles, the attacking goose attacks first
    // and the opposing enemy attacks in retaliation if they are still alive afterwards.
    // and if they are in range
    generate_battle_results() {
        let atk_goose_stats = this.atk_goose.stats;
        let def_goose_stats = this.def_goose.stats;
        
        if (this.atk_goose.stop_distance != 0.0)
            this.actions.push({goose: this.atk_goose, action: "move", other_goose: this.def_goose, duration: 80});
        this.actions.push({goose: this.atk_goose, action: "attack", other_goose: this.def_goose});

        if (def_goose_stats.health - atk_goose_stats.attack + def_goose_stats.defense <= 0) {
            this.actions.push({goose: this.def_goose, action: "dead"});
            this.actions.push({goose: this.atk_goose, other_goose: this.def_goose, action: "camera zoom out"});
            return;
        }

        // Defending goose now retaliates if they are in range
        let manhattan_distance = Math.abs(this.atk_goose.tile_position.x - this.def_goose.tile_position.x)
            + Math.abs(this.atk_goose.tile_position.z - this.def_goose.tile_position.z);
        if (manhattan_distance <= def_goose_stats.attack_range) {
            this.actions.push({goose: this.def_goose, action: "attack", other_goose: this.atk_goose});
            if (atk_goose_stats.health - def_goose_stats.attack + atk_goose_stats.defense <= 0) {
                this.actions.push({goose: this.def_goose, action: "dead"});
                this.actions.push({goose: this.atk_goose, other_goose: this.def_goose, action: "camera zoom out"});
                return;
            }
        }

        this.actions.push({goose: this.atk_goose, other_goose: this.def_goose, action: "camera zoom out"});
    }
}