// This file contains UI stuff
// UI item that contains the 
class Bar {
    constructor(shape, back_bar_material, front_bar_material, max_number, current_number, height, width, world_transform) {
        this.front_bar_material = front_bar_material;
        this.back_bar_material = back_bar_material;
        this.shape = shape;
        this.max_number = max_number;
        this.current_number = current_number;
        this.world_transform = world_transform;
        this.width = width;
        this.height = height;
        this.scale_offset = Mat4.scale([width / 2.0, height, 1 ]);
    }

    set_number(value) {
        this.current_number = value;
        if (this.current_number < 0.0)
            this.current_number = 0.0;
        else if (this.current_number > this.max_number)
            this.current_number = this.max_number;
    }

    render(graphics_state) {
        this.shape.draw(graphics_state, this.world_transform.times(this.scale_offset), this.back_bar_material);
        let scale_factor = this.current_number / this.max_number * this.width;
        let new_scale_offset = Mat4.translation([0, 0, 0]).times(this.world_transform.times(Mat4.scale([scale_factor / 2.0, this.height * 0.9, 1])));
        this.shape.draw(graphics_state, new_scale_offset.times(Mat4.translation([0,0,0.5])), this.front_bar_material);
    }
}

// function add_battle_forecast(menu_manager, material) {
//         let menu_transform_1 = Mat4.translation([0.04,0.02,-0.11]).times(Mat4.scale([0.0112, 0.020, 1]));
//         let text_transform_1 = Mat4.translation([-0.57,0,0.001]).times(Mat4.scale([0.15,0.5,1]));
//         let menu_obj = {menu_transform: menu_transform_1, menu_material: material, tag: "forecast1", text: undefined, text_transform: undefined,  clickable: false};
//         menu_manager.add_menu(menu_obj);
// }

class Battle_Forecast {
    constructor(shape, text_shape, materials, camera_transform, position, height, width, goose1, goose2, turn) {
        // Calculate vector from position to camera
        let camera_pos = Mat4.inverse(camera_transform).times(Vec.of(0,0,0,1)).to3();
        let from_this_to_camera = camera_pos.minus(position);
        this.position = position;
        this.turn = turn;
        let scale_factor = (turn == 'red') ? 1 : -1;
        this.rotation = Quaternion.fromBetweenVectors([0,0,scale_factor], from_this_to_camera);
        this.height = height;
        this.width = width;
        this.base_transforms = [
            Mat4.scale([width / 2.0, height / 2.0, 1]), // Main body
            Mat4.translation([0, height / 2.0 - 7, 0.2]), // Bar
            Mat4.translation([-width / 2.3, height / 2.0 - 12, 0.2]), // HP drop text
            Mat4.translation([-width / 3.0, height / 2.0 - 15, 0.2]), // Damage text
            Mat4.translation([-width / 6.0, height / 2.0 - 3, 0.2]), // Goose class text
        ];
        let manhattan_distance = Math.abs(goose1.tile_position.x - goose2.tile_position.x)
            + Math.abs(goose1.tile_position.z - goose2.tile_position.z);
        let damage_done_by_goose2 = Math.max(0, -goose1.stats.defense + goose2.stats.attack);
        let damage_done_by_goose1 = Math.max(0, -goose2.stats.defense + goose1.stats.attack);
        this.remaining_hp_g1 = (manhattan_distance <= goose2.stats.attack_range) ? (goose1.stats.health - damage_done_by_goose2) : goose1.stats.health;
        this.remaining_hp_g2 = goose2.stats.health - damage_done_by_goose1; 
        this.texts = [
            "HP: " + goose1.stats.health + " -> " + this.remaining_hp_g1,
            "Damage: " + damage_done_by_goose1,
            goose1.constructor.name,
            "HP: " + goose2.stats.health + " -> " + this.remaining_hp_g2,
            "Damage: " + damage_done_by_goose2,
            goose2.constructor.name,
        ]
        this.goose1_bar = new Bar(shape, materials.bar_back.override({ambient: 1}), materials.bar_front.override({ambient: 1}), 100, 100, 2, 13, Mat4.translation([0,0,0]));
        // World transforms
        this.transforms = [
            Mat4.identity(),
            Mat4.identity(),
            Mat4.identity(),
            Mat4.identity(),
            Mat4.identity(),
        ]
        this.goose1 = goose1;
        this.goose2 = goose2;
        this.menu_shape = shape;
        this.text_shape = text_shape;
        this.menu_material1 = materials.menu_1;
        this.menu_material2 = materials.menu_2;
        this.text_material = materials.text;
        this.generate_opponent_forecast(turn);
    }

    generate_opponent_forecast(turn) {
        let size = this.base_transforms.length;
        let scale_factor = (this.turn == 'red') ? 0 : 1;
        let rot_matrix = Mat4.rotation(Math.PI * scale_factor, Vec.of(0,1,0));
        for (let i = 0; i < size; i++) {
            // let scale_matrix = Mat4.scale([1, 1, 1]);
            this.base_transforms.push(Mat4.translation([this.width / 2.0 + 3.0, 0, 0]).times(rot_matrix.times(this.base_transforms[i])));
            this.base_transforms[i] = Mat4.translation([-(this.width / 2.0 + 3.0), 0, 0]).times(rot_matrix.times(this.base_transforms[i]));
            this.transforms.push(Mat4.identity());
        }
    }

    update_transform(camera_transform) {
        let camera_pos = Mat4.inverse(camera_transform).times(Vec.of(0,0,0,1)).to3();
        let from_this_to_camera = camera_pos.minus(this.position);
        let scale_factor = (this.turn == 'red') ? 1 : -1;
        this.rotation = Quaternion.fromBetweenVectors([0,0,scale_factor], from_this_to_camera);
        let rotation_matrix = this.rotation.toMatrix4(true);
        let rot = Mat4.of(rotation_matrix[0], rotation_matrix[1], rotation_matrix[2], rotation_matrix[3]);
        for (let i in this.transforms) {
            this.transforms[i] = Mat4.translation([this.position[0], this.position[1], this.position[2]])
                .times(rot.times(this.base_transforms[i]));
        }
    }

    render(graphics_state, context) {
        let string_counter = 0;
        for (let i in this.transforms) {
            if (i == 1 || i == 6) {
                // bars
                this.goose1_bar.set_number((i == 1) ? this.remaining_hp_g1 : this.remaining_hp_g2);
                this.goose1_bar.world_transform = this.transforms[i];
                this.goose1_bar.render(graphics_state);
            } else if (i == 2 || i == 3 || i == 4 || i == 7 || i == 8 || i == 9)  {
                // Text elements
                this.text_shape.set_string(this.texts[string_counter], context);
                this.text_shape.draw(graphics_state, this.transforms[i], this.text_material );
                string_counter++;
            } else if (i == 0) {
                this.menu_shape.draw(graphics_state, this.transforms[i], this.menu_material1);
            } else
                this.menu_shape.draw(graphics_state, this.transforms[i], this.menu_material2);
        }
    }
}