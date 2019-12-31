// Stronk class
// This is a derived class for a Stronk,
// a high attack, low movement character.
class Stronk extends Goose {
    constructor(goose_id, x, z, orientation) { 
        super ( goose_id, x, z, orientation );
        this.stats.attack = 125;
        this.stats.defense = 25;
        this.stats.movement_range = 4;
        this.stats.attack_range = 1;

        let tag = '_' + this.constructor.name + this.stats.goose_id;
        let head = 'head' + tag;
        let left_eyebrow = 'left_eyebrow' + tag;
        let right_eyebrow = 'right_eyebrow' + tag;
        let left_eye = 'left_eye' + tag;
        let right_eye = 'right_eye' + tag;
        let top_beak = 'top_beak' + tag;
        let bottom_beak = 'bottom_beak' + tag;
        let neck = 'neck' + tag;
        let body = 'body' + tag;
        let left_wing = 'left_wing' + tag;
        let right_wing = 'right_wing' + tag;
        let left_leg = 'left_leg' + tag;
        let right_leg = 'right_leg' + tag;
        let left_foot = 'left_foot' + tag;
        let right_foot = 'right_foot' + tag;
        let marker_strip = 'marker_strip' + tag;

        //Overwrite these initial transforms.
        this.transforms[left_leg]       = Mat4.translation([ -4, -2.25,-1]).times(Mat4.scale([3,2,3])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0)));
        this.transforms[right_leg]      = Mat4.translation([ -4, -2.25, 1]).times(Mat4.scale([3,2,3])).times(Mat4.rotation( Math.PI/2, Vec.of( 1, 0, 0)));
        this.transforms[left_wing]      = Mat4.translation([ -7, -4, 0]).times(Mat4.scale([ 1, 1,-1])).times(Mat4.translation([ 0, 0, 1.8])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'left_wing'
        this.transforms[body]           = Mat4.translation([ -6, -4, 1.8]).times(Mat4.scale([ 1, 1, 1.8])); // 'body'
        this.transforms[right_wing]     = Mat4.translation([ -7, -4, 0]).times(Mat4.translation([ 0, 0, 1.8])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'right_wing'
        this.transforms[left_foot]      = Mat4.translation([ -4.25, -9.25,-1]).times(Mat4.scale([1.3,1.3,1.3])); // 'left_foot'
        this.transforms[right_foot]     = Mat4.translation([ -4.25, -9.25, 1]).times(Mat4.scale([1.3,1.3,1.3]));

        this.transforms[head]           = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[head]);
        this.transforms[left_eyebrow]   = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[left_eyebrow]);
        this.transforms[right_eyebrow]  = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[right_eyebrow]);
        this.transforms[left_eye]       = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[left_eye]);
        this.transforms[right_eye]      = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[right_eye]);
        this.transforms[top_beak]       = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[top_beak]);
        this.transforms[bottom_beak]    = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[bottom_beak]);
        this.transforms[neck]           = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[neck]);
        this.transforms[marker_strip]   = Mat4.translation([ 0, 3.5, 0]).times(this.transforms[marker_strip]);


        // Add thighs.
        this.shapes['left_thigh' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['left_thigh' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-5,-1]).times(Mat4.scale([1.2,1.2,1.2]));
        this.colors['left_thigh' + '_' + this.constructor.name + goose_id] = 'orange';

        this.shapes['right_thigh' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['right_thigh' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-5, 1]).times(Mat4.scale([1.2,1.2,1.2]));
        this.colors['right_thigh' + '_' + this.constructor.name + goose_id] = 'orange';
        

        // Add calves.
        this.shapes['left_calf' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['left_calf' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-7.5,-1]);
        this.colors['left_calf' + '_' + this.constructor.name + goose_id] = 'orange';

        this.shapes['right_calf' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(3);
        this.transforms['right_calf' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-7.5, 1]);
        this.colors['right_calf' + '_' + this.constructor.name + goose_id] = 'orange';

        this.head_pos = [0, 3.5];
        this.body_angle = 0;

        this.setup();
    }

    attack = () => {
        this.animate_setup();

        let t_frames = 140;
        //let factor = t_frames / 100;
        if (this.state.frameNumber == 0) {
            this.state.frameNumber = t_frames;
            this.head_pos = [0, 3.5];
            this.body_angle = 0;
        }
            
        let tag = '_' + this.constructor.name + this.stats.goose_id;
        let head = 'head' + tag;
        let left_eyebrow = 'left_eyebrow' + tag;
        let right_eyebrow = 'right_eyebrow' + tag;
        let left_eye = 'left_eye' + tag;
        let right_eye = 'right_eye' + tag;
        let top_beak = 'top_beak' + tag;
        let bottom_beak = 'bottom_beak' + tag;
        let neck = 'neck' + tag;
        let body = 'body' + tag;
        let left_wing = 'left_wing' + tag;
        let right_wing = 'right_wing' + tag;
        let left_leg = 'left_leg' + tag;
        let right_leg = 'right_leg' + tag;
        let left_thigh = 'left_thigh' + tag;
        let right_thigh = 'right_thigh' + tag;
        let left_calf = 'left_calf' + tag;
        let right_calf = 'right_calf' + tag;
        let left_foot = 'left_foot' + tag;
        let right_foot = 'right_foot' + tag;
        let marker_strip = 'marker_strip' + tag;
        
        let body_down_transform = Mat4.translation([-4,-3.25, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,3.25,0]));
        let body_up_transform = Mat4.translation([-4,-3.25, 0]) // move neck with body
            .times(Mat4.rotation(Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,3.25,0]));
        
        let leg_down_transform = Mat4.translation([-4,-3.25, 0])
            .times(Mat4.rotation(-Math.PI / 100 / (2.25/3), Vec.of(0,0,1)))
            .times(Mat4.translation([4,3.25,0]));
 
        if (this.state.frameNumber == 80 && !this.state.game_over) {
            this.attack_sound.play();
        }

        if (this.state.frameNumber > t_frames * 12/14) {
            this.transforms[left_eyebrow] = Mat4.translation([ 0.5, 4.25,-0.4])
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -4.25, 0.4]))
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = Mat4.translation([ 0.5, 4.25, 0.4])
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -4.25,-0.4]))
                .times(this.transforms[right_eyebrow]);
            
        }
        else if (this.state.frameNumber > t_frames * 9/14) {
            this.transforms[head] = body_down_transform
                .times(this.transforms[head]);
            
            let new_head_pos = body_down_transform.times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
            let face_transform = Mat4.translation([new_head_pos[0] - this.head_pos[0], new_head_pos[1] - this.head_pos[1], 0]);
            this.head_pos = [new_head_pos[0], new_head_pos[1]];

            this.transforms[left_eyebrow] = face_transform
                .times(this.transforms[left_eyebrow]);
                
            this.transforms[right_eyebrow] = face_transform
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = face_transform
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = face_transform
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = face_transform
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = face_transform
                .times(this.transforms[bottom_beak]);

            this.transforms[neck] = body_down_transform
                .times(this.transforms[neck]);
            
            this.body_angle += Math.PI / 100 / 2.25;

            this.transforms[left_wing] = Mat4.translation([-4,-3.25, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(Mat4.translation([ -7,-1,-1.8]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,1,1.8]))
                .times(Mat4.translation([-4,-3.25, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(body_down_transform)
                .times(this.transforms[left_wing]);    

            this.transforms[body] = body_down_transform
                .times(this.transforms[body]);
            
            this.transforms[marker_strip] = body_down_transform
                .times(this.transforms[marker_strip]);

            this.transforms[right_wing] = Mat4.translation([-4,-3.25, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(Mat4.translation([ -7,-1,1.8]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,1,-1.8]))
                .times(Mat4.translation([-4,-3.25, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(body_down_transform)
                .times(this.transforms[right_wing]);
            
            this.transforms[right_leg] = leg_down_transform
                .times(this.transforms[right_leg]);
            
            this.transforms[right_thigh] = leg_down_transform
                .times(this.transforms[right_thigh]);
            
            this.transforms[right_calf] = leg_down_transform
                .times(this.transforms[right_calf]);
            
            this.transforms[right_foot] = leg_down_transform
                .times(this.transforms[right_foot]);
          
        }
        else if (this.state.frameNumber > t_frames * 8/14) {
            let leg_rotation = Mat4.translation([-4,-3.25, 0]) // move neck with body
                .times(Mat4.rotation( Math.PI / 25, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]));
            
            this.transforms[right_leg] = leg_rotation
                .times(this.transforms[right_leg]);
            
            this.transforms[right_thigh] = leg_rotation
                .times(this.transforms[right_thigh]);
            
            this.transforms[right_calf] = leg_rotation
                .times(this.transforms[right_calf]);
            
            this.transforms[right_foot] = leg_rotation
                .times(this.transforms[right_foot]);
                
        }
        else if (this.state.frameNumber > t_frames * 5/14) {
            for (let t in this.transforms) {
                this.transforms[t] = Mat4.translation([0, 0, 0])
                    .times(Mat4.rotation(Math.PI / 15, Vec.of(0,0,1)))
                    .times(Mat4.translation([0, 0, 0]))
                    .times(this.transforms[t]);
            }

            this.state.inflict_damage_other = (this.state.frameNumber == t_frames / 2);
        }
        else if (this.state.frameNumber > t_frames * 2/14) {
            this.transforms[head] = body_up_transform
                .times(this.transforms[head]);
            
            let new_head_pos = body_up_transform.times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
            let face_transform = Mat4.translation([new_head_pos[0] - this.head_pos[0], new_head_pos[1] - this.head_pos[1], 0]);
            this.head_pos = [new_head_pos[0], new_head_pos[1]];

            this.transforms[left_eyebrow] = face_transform
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = face_transform
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = face_transform
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = face_transform
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = face_transform
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = face_transform
                .times(this.transforms[bottom_beak]);            
             
            this.transforms[neck] = body_up_transform
                .times(this.transforms[neck]);

            this.body_angle -= Math.PI / 100 / 2.25;
                        
            this.transforms[left_wing] = Mat4.translation([-4,-3.25, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(Mat4.translation([ -7,-1,-1.8]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,1,1.8]))
                .times(Mat4.translation([-4,-3.25, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(body_up_transform)
                .times(this.transforms[left_wing]);    

            this.transforms[body] = body_up_transform
                .times(this.transforms[body]);
            
            this.transforms[marker_strip] = body_up_transform
                .times(this.transforms[marker_strip]);

            this.transforms[right_wing] = Mat4.translation([-4,-3.25, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(Mat4.translation([ -7,-1,1.8]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,1,-1.8]))
                .times(Mat4.translation([-4,-3.25, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,3.25,0]))
                .times(body_up_transform)
                .times(this.transforms[right_wing]);
            
        }
        else {
            this.transforms[left_eyebrow] = Mat4.translation([ 0.5, 4.25,-0.4])
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -4.25, 0.4]))
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = Mat4.translation([ 0.5, 4.25, 0.4])
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -4.25,-0.4]))
                .times(this.transforms[right_eyebrow]);            
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0) {
            this.state.animating = false;
            this.head_pos = [0, 0];
            this.body_angle = 3.5;
        }

        this.animate_reset();
    }
}