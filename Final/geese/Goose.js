// Goose class
// This is the base class for all goose classes
// Contains stats used for battle calculations and
// shapes and transforms that pertain the body parts
// of this goose.
class Goose {
    constructor(goose_id, x, z, orientation) {

        this.stats = {
            health: 100,
            attack: 50,
            defense: 25,
            movement_range: 6,
            attack_range: 1,
            goose_id: goose_id,
        };

        this.state = {
            animating: false,
            frameNumber: 0,
            inflict_damage_other: false,
            orientation: orientation, // 0 is right, 1 is up, 2 is left, 3 is down
            path_itr: 0,
            hasMoved: false,
            game_over: false,
        };

        this.attack_sound = undefined; // passed in arena-scene

        this.prev = {
            orientation: orientation,
            x: x,
            z: z,
        }

        this.tile_position = {
            x: x,
            z: z,
        };

        this.translation = {
            x: 0,
            y: 0,
            z: 0,
        }

        let shape_names = [
            'head',
            'left_eyebrow',
            'right_eyebrow',
            'left_eye',
            'right_eye',
            'top_beak',
            'bottom_beak',
            'neck',
            'left_wing',
            'body',
            'right_wing',
            'left_leg',
            'right_leg',
            'left_foot',
            'right_foot',
            'marker_strip',
        ];

        let shapes = [
            new Subdivision_Sphere(3), // 'head'
            new Cube(), // 'left_eyebrow'
            new Cube(), // 'right_eyebrow'
            new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]), // 'left_eye'
            new Rounded_Capped_Cylinder(12, 12, .2, .1, [0,1]), // 'right_eye'
            new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]), // 'top_beak'
            new Rounded_Cone(12, 12, 1, 2, Math.PI, [0,1]), // 'bottom_beak'
            new Rounded_Capped_Cylinder(12, 12, .6, 4, [0,1]), // 'neck'
            new Wing(), // 'left_wing'
            new Body(), // 'body'
            new Wing(), // 'right_wing'
            new Rounded_Capped_Cylinder(12, 12, .2, 3.5, [0,1]), // 'left_leg'
            new Rounded_Capped_Cylinder(12, 12, .2, 3.5, [0,1]), // 'right_leg'
            new Foot(), // 'left_foot'
            new Foot(), // 'right_foot'
            new Cube(), // 'marker_strip'
        ];

        let shape_transforms = [
            Mat4.identity(), // 'head'
            Mat4.identity().times(Mat4.translation([ 0.5, 0.75,-0.4])).times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1))).times(Mat4.rotation(-Math.PI/12, Vec.of(1,0,0))).times(Mat4.scale([ 0.05, 0.04, 0.25])), // 'left_eyebrow'
            Mat4.identity().times(Mat4.translation([ 0.5, 0.75, 0.4])).times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1))).times(Mat4.rotation( Math.PI/12, Vec.of(1,0,0))).times(Mat4.scale([ 0.05, 0.04, 0.25])), // 'right_eyebrow'
            Mat4.identity().times(Mat4.rotation(-Math.PI/3, Vec.of(0,1,0))).times(Mat4.rotation( Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0,-1]))), // 'left_eye'
            Mat4.identity().times(Mat4.rotation( Math.PI/3, Vec.of(0,1,0))).times(Mat4.rotation(-Math.PI/6, Vec.of(1,0,0)).times(Mat4.translation([ 0, 0, 1]))), // 'right_eye'
            Mat4.identity().times(Mat4.translation([ 0, -0.1, 0])).times(Mat4.scale([ 0.9, 0.6, 0.9])).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), // 'top_beak'
            Mat4.identity().times(Mat4.translation([ 0, -0.1, 0])).times(Mat4.scale([ 0.9, 0.6, 0.9])).times(Mat4.rotation( Math.PI, Vec.of(1,0,0))).times(Mat4.rotation( Math.PI/2, Vec.of(0,1,0))), // 'bottom_beak'
            Mat4.identity().times(Mat4.translation([ -0.4, 0, 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))), // 'neck'
            Mat4.identity().times(Mat4.translation([ -7, -7.5,-1])).times(Mat4.scale([ 1.2, 1.2,-1.2])), // 'left_wing'
            Mat4.identity().times(Mat4.translation([ -6, -7.5, 1])), // 'body'
            Mat4.identity().times(Mat4.translation([ -7, -7.5, 1])).times(Mat4.scale([ 1.2, 1.2, 1.2])), // 'right_wing'
            Mat4.identity().times(Mat4.translation([ -4, -5.75,-.75])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), // 'left_leg'
            Mat4.identity().times(Mat4.translation([ -4, -5.75, .75])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0))), // 'right_leg'
            Mat4.identity().times(Mat4.translation([ -4.25, -9.25,-.75])), // 'left_foot'
            Mat4.identity().times(Mat4.translation([ -4.25, -9.25, .75])), // 'right_foot'
            Mat4.identity().times(Mat4.translation([-1,-3.75,0])).times(Mat4.rotation(Math.PI/18, Vec.of(0,0,1))).times(Mat4.translation([-3.4,0,0])).times(Mat4.scale([3.7, 0.01, 0.5])), //'marker_strip'            
        ];

        // These transforms are here temporarily to help with battle scene movements
        // and are decoupled from the transforms for the geese
        this.temp_scale_transform = Mat4.scale([1,1,1]);
        this.temp_translation_transform = Mat4.translation([0,0,0]);
        this.stop_distance = 0.5; // Defines how much distance the goose will travel relative to the other goose when attacking 
        this.move_animation_duration = 40; // Defines the duration for how long the move towards enemy goose animation lasts
        this.distance_offset = 5; // Defines how far the camera should go out

        let shape_colors = [
            'white', // 'head'
            'black', // 'left_eyebrow'
            'black', // 'right_eyebrow'
            'black', // 'left_eye'
            'black', // 'right_eye'
            'orange', // 'top_beak'
            'orange', // 'bottom_beak'
            'white', // 'neck'
            'white', // 'left_wing'
            'white', // 'body'
            'white', // 'right_wing'
            'orange', // 'left_leg'
            'orange', // 'right_leg'
            'orange', // 'left_foot'
            'orange', // 'right_foot'
            this.getTeam(), // 'marker_strip'
        ];

        // shape's key is specifically: shape_name + Goose + goose_id

        // shape -> shape's constructor
        this.shapes = {};
        // shape -> shape's transform
        this.transforms = {};
        // shape -> shape's color
        this.colors = {};
        for (let i = 0; i < shape_names.length; i++) {
            this.shapes[shape_names[i] + '_' + this.constructor.name + goose_id] = shapes[i];
            this.transforms[shape_names[i] + '_' + this.constructor.name + goose_id] = shape_transforms[i];
            this.colors[shape_names[i] + '_' + this.constructor.name + goose_id] = shape_colors[i];
        }
    }

    setup = () => {
        // move feet to origin
        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.translation([4.25, 9.35, 0]).times(this.transforms[transform]);

        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.scale([0.75,0.75,0.75]).times(this.transforms[transform]);

        // set goose's original orientation
        this.rotate_goose(0, this.state.orientation);

        // calculate tile location
        let tile_coords = calculate_world_pos_from_tile(this.tile_position.x, this.tile_position.z, 10, 10);

        this.translation.x += tile_coords[0];
        this.translation.z += tile_coords[2];
    }

    getTeam = () => {
        return this.stats.goose_id % 2 == 0 ? 'red' : 'blue';
    }

    rotate_goose = (old_orientation, new_orientation) => {
        if (old_orientation == new_orientation)
            return;
        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.rotation(2 * Math.PI / 4 * (new_orientation - old_orientation), Vec.of(0,1,0)).times(this.transforms[transform]);
    }

    // Similar to rotate goose, but does it in an interpolated way within max_frames
    // also handles new orientations:
    // up right: 0.5
    // up left: 1.5
    // down left: 2.5
    // down right: 3.5
    // These are not saved as state when used. This is here for the battle scene manager
    lerp_rotate_goose(old_orientation, new_orientation, max_frames) {
        if (old_orientation == new_orientation)
            return;
        let pct = Math.PI / 2.0 / max_frames; // Which percentage to rotate
        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.rotation(pct * (new_orientation - old_orientation), Vec.of(0,1,0)).times(this.transforms[transform]);
    }

    animate_setup = () => {
        this.rotate_goose(this.state.orientation, 0);
        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.scale([4/3,4/3,4/3]).times(this.transforms[transform]);
        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.translation([-4.25, -9.35, 0]).times(this.transforms[transform]);
    }

    animate_reset = () => {
        for (let transform in this.transforms)
        this.transforms[transform] = Mat4.translation([4.25, 9.35, 0]).times(this.transforms[transform]);
        for (let transform in this.transforms)
            this.transforms[transform] = Mat4.scale([0.75,0.75,0.75]).times(this.transforms[transform]);
        this.rotate_goose(0, this.state.orientation);
    }

    // generate path, responsible for rotating goose before calling moveOneCell()
    move = (path) => {
        if (path == "")
            return false;

        let movement_char = path[this.state.path_itr];
        let new_orientation;
        switch(movement_char) {
            case 'R': new_orientation = 0; this.moveOneCell(1,0); break;
            case 'U': new_orientation = 1; this.moveOneCell(0,1); break;
            case 'L': new_orientation = 2; this.moveOneCell(-1,0); break;
            case 'D': new_orientation = 3; this.moveOneCell(0,-1); break;
        }

        this.rotate_goose(this.state.orientation, new_orientation);
        this.state.orientation = new_orientation;
        
        if (this.state.path_itr == path.length) {
            this.state.path_itr = 0;
            return false;
        }
        else
            return true;
    }

    // TODO: fix flapping?
    moveOneCell = (x, z) => {
        let t_frames = 10;
        let increment = 1;
        if (this.state.frameNumber == 0)
            this.state.frameNumber = t_frames;

        if (this.state.frameNumber > t_frames/2) {
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0,1,0]).times(this.transforms[shape]);
            }
            this.translation.x += increment * x;
            this.translation.z += -increment * z;
        }
        else {
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0,-1,0]).times(this.transforms[shape]);
            }
            this.translation.x += increment * x;
            this.translation.z += -increment * z;
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0)
            this.state.path_itr++;
    }
}


