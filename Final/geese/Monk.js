// Monk class
// This is a derived class for a Monk,
// a character that provides magical attacks, has low defense and moves normally.
class Monk extends Goose {
    constructor(goose_id, x, z, orientation) { 
        super ( goose_id, x, z, orientation );
        this.stats.attack = 100;
        this.stats.defense = 0;
        this.stats.movement_range = 3;
        this.stats.attack_range = 3;

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

        // Add hat and cape.
        this.shapes['hat_tip' + '_' + this.constructor.name + goose_id] = new Rounded_Cone(12, 12, 1, 3, 2*Math.PI, [0,1]),
        this.transforms['hat_tip' + '_' + this.constructor.name + goose_id] = Mat4.translation([-0.2, 0.7, 0.2]).times(Mat4.rotation(Math.PI/8, Vec.of(0,0,1))).times(Mat4.rotation(-Math.PI/2 + Math.PI/9, Vec.of(1,0,0)));
        this.colors['hat_tip' + '_' + this.constructor.name + goose_id] = 'orange';

        this.shapes['hat_base' + '_' + this.constructor.name + goose_id] = new Cube(),
        this.transforms['hat_base' + '_' + this.constructor.name + goose_id] = Mat4.translation([-0.2, 0.7, 0.2]).times(Mat4.rotation(Math.PI/8, Vec.of(0,0,1))).times(Mat4.rotation(Math.PI/9, Vec.of(1,0,0))).times(Mat4.scale([1.2,0.1,1.2]));
        this.colors['hat_base' + '_' + this.constructor.name + goose_id] = 'black';

        this.shapes['cape' + '_' + this.constructor.name + goose_id] = new Cape(20, 20);
        this.transforms['cape' + '_' + this.constructor.name + goose_id] = Mat4.translation([-0.4,-3,0]);
        this.colors['cape' + '_' + this.constructor.name + goose_id] = this.getTeam();
        
        this.animate_shader = false;
        this.temp_frame = 0;
        this.state_flap = 1;  // 0 = down, 1 = up

        this.setup();

        this.head_pos = [0, 0];
        this.cape_pos = [-0.4,-2.0];
        this.body_angle = 0;
    }

    attack = () => {
        this.animate_setup();

        let t_frames = 180;

        if (this.state.frameNumber == 0) {
            this.state.frameNumber = t_frames;
            this.animate_shader = false;
            this.head_pos = [0, 0];
            this.cape_pos = [-0.4,-2.4];
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
        let marker_strip = 'marker_strip' + tag;
        let left_wing = 'left_wing' + tag;
        let right_wing = 'right_wing' + tag;
        let hat_tip = 'hat_tip' + tag;
        let hat_base = 'hat_base' + tag;
        let cape = 'cape' + tag;

        let neck_down_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(-Math.PI / 200 / 1.5, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
        let neck_up_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(Math.PI / 200 / 1.5, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
            
        let body_down_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));
        let body_up_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));
            
        if (this.state.frameNumber == 140 && !this.state.game_over) {
            this.attack_sound.play();
        }

        if (this.state.frameNumber > t_frames * 16/18) {
            this.transforms[left_eyebrow] = Mat4.translation([ 0.5, 0.75,-0.4])
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -0.75, 0.4]))
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = Mat4.translation([ 0.5, 0.75, 0.4])
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -0.75,-0.4]))
                .times(this.transforms[right_eyebrow]);

            this.transforms[cape] = Mat4.translation([0, 0.03, 0])
                .times(this.transforms[cape]);
        }
        
        else if (this.state.frameNumber > t_frames * 13/18) {
            this.transforms[head] = body_up_transform
                .times(neck_up_transform)
                .times(this.transforms[head]);

            let new_head_pos = body_up_transform.times(neck_up_transform).times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
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

            this.transforms[hat_tip] = face_transform
                .times(this.transforms[hat_tip]);

            this.transforms[hat_base] = face_transform
                .times(this.transforms[hat_base]);

            this.transforms[top_beak] = Mat4.translation([this.head_pos[0] + 1, this.head_pos[1], 0])
                .times(Mat4.rotation(Math.PI / 100 / 3, Vec.of(0,0,1)))
                .times(Mat4.translation([-(this.head_pos[0] + 1), -this.head_pos[1], 0]))
                .times(face_transform)
                .times(this.transforms[top_beak]);

            this.transforms[bottom_beak] = Mat4.translation([this.head_pos[0] + 1, this.head_pos[1], 0])
                .times(Mat4.rotation(-Math.PI / 100 / 2, Vec.of(0,0,1)))
                .times(Mat4.translation([-(this.head_pos[0] + 1), -this.head_pos[1], 0]))
                .times(face_transform)
                .times(this.transforms[bottom_beak]);

            this.transforms[neck] = body_up_transform
                .times(neck_up_transform)
                .times(this.transforms[neck]);
            
            let new_cape_pos = body_up_transform.times(neck_up_transform).times(Vec.of(this.cape_pos[0],this.cape_pos[1],0,1));
            let cape_transform = Mat4.translation([new_cape_pos[0] - this.cape_pos[0], new_cape_pos[1] - this.cape_pos[1], 0]);
            this.cape_pos = [new_cape_pos[0], new_cape_pos[1]];

            this.transforms[cape] = cape_transform
                .times(this.transforms[cape]);

            this.body_angle -= Math.PI / 100 / 2.25;

            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_up_transform)
                .times(this.transforms[left_wing]);    

            this.transforms[body] = body_up_transform
                .times(this.transforms[body]);
            
            this.transforms[marker_strip] = body_up_transform
                .times(this.transforms[marker_strip]);

            this.transforms[right_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,1]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_up_transform)
                .times(this.transforms[right_wing]);

        } 
        else if (this.state.frameNumber > t_frames * 7/18) {
            // Flap wings wildly
            this.animate_shader = true;

            let num_times = 6; // 5.0 / (4.0 * 14);
            if (this.temp_frame == 0) {
                this.state_flap = !this.state_flap;
                this.temp_frame = Math.floor(num_times);
            }
            if (this.state_flap == 0) {
                // flap down
                this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                    .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                    .times(Mat4.translation([4,6.75,0]))
                    .times(Mat4.translation([ -7,-4.5,-1]))
                    .times(Mat4.rotation(-Math.PI / 50 / 0.6, Vec.of(1,0,0)))
                    .times(Mat4.translation([ 7,4.5,1]))
                    .times(Mat4.translation([-4,-6.75, 0]))
                    .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                    .times(Mat4.translation([4,6.75,0]))
                    .times(this.transforms[left_wing]); 

                this.transforms[right_wing] = Mat4.translation([-4,-6.75, 0])
                    .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                    .times(Mat4.translation([4,6.75,0]))
                    .times(Mat4.translation([ -7,-4.5,1]))
                    .times(Mat4.rotation(Math.PI / 50 / 0.6, Vec.of(1,0,0)))
                    .times(Mat4.translation([ 7,4.5,-1]))
                    .times(Mat4.translation([-4,-6.75, 0]))
                    .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                    .times(Mat4.translation([4,6.75,0]))
                    .times(this.transforms[right_wing]); 
            } 
            else if (this.state_flap == 1) {
                // Flap up
                this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(Math.PI / 50 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(this.transforms[left_wing]);  

                this.transforms[right_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,1]))
                .times(Mat4.rotation(-Math.PI / 50 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(this.transforms[right_wing]);
            }
            this.temp_frame--;

            this.state.inflict_damage_other = (this.state.frameNumber == t_frames / 2);
        } 
        else if (this.state.frameNumber > t_frames * 4/18) {
            this.transforms[head] = neck_down_transform
                .times(body_down_transform)
                .times(this.transforms[head]);
            
            let new_head_pos = neck_down_transform.times(body_down_transform).times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
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
                
            this.transforms[hat_tip] = face_transform
                .times(this.transforms[hat_tip]);
    
            this.transforms[hat_base] = face_transform
                .times(this.transforms[hat_base]);
            
            this.transforms[top_beak] = Mat4.translation([this.head_pos[0] + 1, this.head_pos[1], 0])
                .times(Mat4.rotation(-Math.PI / 100 / 3, Vec.of(0,0,1)))
                .times(Mat4.translation([-(this.head_pos[0] + 1), -this.head_pos[1], 0]))
                .times(face_transform)
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = Mat4.translation([this.head_pos[0] + 1, this.head_pos[1], 0])
                .times(Mat4.rotation(Math.PI / 100 / 2, Vec.of(0,0,1)))
                .times(Mat4.translation([-(this.head_pos[0] + 1), -this.head_pos[1], 0]))
                .times(face_transform)
                .times(this.transforms[bottom_beak]);            
             
            this.transforms[neck] = neck_down_transform
                .times(body_down_transform)
                .times(this.transforms[neck]);

            let new_cape_pos = neck_down_transform.times(body_down_transform).times(Vec.of(this.cape_pos[0],this.cape_pos[1],0,1));
            let cape_transform = Mat4.translation([new_cape_pos[0] - this.cape_pos[0], new_cape_pos[1] - this.cape_pos[1], 0]);
            this.cape_pos = [new_cape_pos[0], new_cape_pos[1]];

            this.transforms[cape] = cape_transform
                .times(this.transforms[cape]);
            
            this.body_angle += Math.PI / 100 / 2.25;
            
            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_down_transform)
                .times(this.transforms[left_wing]);    

            this.transforms[body] = body_down_transform
                .times(this.transforms[body]);
            
            this.transforms[marker_strip] = body_down_transform
                .times(this.transforms[marker_strip]);

            this.transforms[right_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,1]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_down_transform)
                .times(this.transforms[right_wing]);  
        } 
        
        else if (this.state.frameNumber > t_frames * 2/18) {
            ;
        } 
        else {
            this.transforms[left_eyebrow] = Mat4.translation([ 0.5, 0.75,-0.4])
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -0.75, 0.4]))
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = Mat4.translation([ 0.5, 0.75, 0.4])
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -0.75,-0.4]))
                .times(this.transforms[right_eyebrow]);

            this.transforms[cape] = Mat4.translation([0,-0.03, 0])
                .times(this.transforms[cape]);
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0) {
            this.animate_shader = false;
            this.state.animating = false;
            this.head_pos = [0, 0];
            this.cape_pos = [-0.4,-2.0];
            this.body_angle = 0;
        }

        this.animate_reset();
    }    
}