// Lonk class
// This is a derived class for a Lonk,
// a longer range character.
class Lonk extends Goose {
    constructor(goose_id, x, z, orientation) { 
        super ( goose_id, x, z, orientation );
        this.stats.attack = 75;
        this.stats.defense = 25;
        this.stats.movement_range = 4;
        this.stats.attack_range = 2;

        let tag = '_' + this.constructor.name + this.stats.goose_id;
        let neck = 'neck' + tag;
        let head = 'head' + tag;
        let left_eyebrow = 'left_eyebrow' + tag;
        let right_eyebrow = 'right_eyebrow' + tag;
        let left_eye = 'left_eye' + tag;
        let right_eye = 'right_eye' + tag;
        let top_beak = 'top_beak' + tag;
        let bottom_beak = 'bottom_beak' + tag;

        this.stats.attack_range = 2;

        //Overwrite these initial transforms.
        this.transforms[neck]           = Mat4.identity().times(Mat4.translation([ -0.4, 4.0, 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([ 1, 1, 2]));
        this.transforms[head]           = Mat4.translation([ 0, 4, 0]).times(this.transforms[head]);
        this.transforms[left_eyebrow]   = Mat4.translation([ 0, 4, 0]).times(this.transforms[left_eyebrow]);
        this.transforms[right_eyebrow]  = Mat4.translation([ 0, 4, 0]).times(this.transforms[right_eyebrow]);
        this.transforms[left_eye]       = Mat4.translation([ 0, 4, 0]).times(this.transforms[left_eye]);
        this.transforms[right_eye]      = Mat4.translation([ 0, 4, 0]).times(this.transforms[right_eye]);
        this.transforms[top_beak]       = Mat4.translation([ 0, 4, 0]).times(this.transforms[top_beak]);
        this.transforms[bottom_beak]    = Mat4.translation([ 0, 4, 0]).times(this.transforms[bottom_beak]);
        this.setup();
        
        this.body_angle = 0.0;

        this.scale_factor = 2.0;
        this.scale_change = 0.15;
    }

    attack = () => {
        this.animate_setup();

        let t_frames = 140;
        if (this.state.frameNumber == 0) {
            this.state.frameNumber = t_frames;
            this.body_angle = 0;
            this.scale_factor = 2.0;
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
        let marker_strip = 'marker_strip' + tag;

        let head_down_transform;
        let head_up_transform;
        
        let neck_down_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(-Math.PI / 100 / 2, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
        let neck_up_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(Math.PI / 100 / 2, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
            
        let body_down_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / 100 / 3, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));
        let body_up_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(Math.PI / 100 / 3, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));

        if (this.state.frameNumber == 135 && !this.state.game_over) {
            this.attack_sound.play();
        }

        if (this.state.frameNumber > t_frames * 12/14) {
            this.transforms[left_eyebrow] = Mat4.translation([ 0.5, 0.75 + 4 * (this.scale_factor - 1),-0.4])
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5, -(0.75 + 4 * (this.scale_factor - 1)), 0.4]))
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = Mat4.translation([ 0.5, 0.75 + 4 * (this.scale_factor - 1), 0.4])
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5,  -(0.75 + 4 * (this.scale_factor - 1)),-0.4]))
                .times(this.transforms[right_eyebrow]);
            
            this.scale_factor += this.scale_change;

            this.transforms[neck] = Mat4.identity().times(Mat4.translation([ -0.4, 4.0 * (this.scale_factor - 1.0), 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([ 1, 1, this.scale_factor]));

            this.transforms[head] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[head]);
                
            this.transforms[left_eyebrow] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[left_eyebrow]);
                
            this.transforms[right_eyebrow] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = Mat4.translation([ 0, this.scale_change * 4, 0])
                .times(this.transforms[bottom_beak]);

        }
        else if (this.state.frameNumber > t_frames * 8/14) {
            this.transforms[head] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[head]);
                
            this.transforms[left_eyebrow] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[left_eyebrow]);
                
            this.transforms[right_eyebrow] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = body_down_transform
                .times(neck_down_transform)
                .times(this.transforms[bottom_beak]);

            this.transforms[neck] = Mat4.identity()
                .times(body_down_transform)
                .times(neck_down_transform)
                .times(this.transforms[neck]);
                
            this.body_angle += Math.PI / 100 / 3;
                   
            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(Math.PI / 100 / 0.8, Vec.of(1,0,0)))
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
                .times(Mat4.rotation(-Math.PI / 100 / 0.8, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_down_transform)
                .times(this.transforms[right_wing]);  
        }
        else if (this.state.frameNumber > t_frames * 6/14) {
            this.state.inflict_damage_other = (this.state.frameNumber == t_frames / 2);
        }
        else if (this.state.frameNumber > t_frames * 2/14) {
            this.transforms[head] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[head]);

            this.transforms[left_eyebrow] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[bottom_beak]);
             
            this.transforms[neck] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[neck]);
            
            this.body_angle -= Math.PI / 100 / 3;
            
            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.8, Vec.of(1,0,0)))
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
                .times(Mat4.rotation(Math.PI / 100 / 0.8, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_up_transform)
                .times(this.transforms[right_wing]); 
        }
        else {
            this.transforms[left_eyebrow] = Mat4.translation([ 0.5, 0.75 + 4 * (this.scale_factor - 1),-0.4])
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5,  -(0.75 + 4 * (this.scale_factor - 1)), 0.4]))
                .times(this.transforms[left_eyebrow]);

            this.transforms[right_eyebrow] = Mat4.translation([ 0.5, 0.75 + 4 * (this.scale_factor - 1), 0.4])
                .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.rotation( Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI / 100 / 1.2, Vec.of(1,0,0)))
                .times(Mat4.rotation(-Math.PI/4, Vec.of(0,0,1)))
                .times(Mat4.rotation( Math.PI/6, Vec.of(0,1,0)))
                .times(Mat4.translation([ -0.5,  -(0.75 + 4 * (this.scale_factor - 1)),-0.4]))
                .times(this.transforms[right_eyebrow]);

            this.scale_factor -= this.scale_change;

            this.transforms[neck] = Mat4.identity().times(Mat4.translation([ -0.4, 4.0 * (this.scale_factor - 1.0), 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([ 1, 1, this.scale_factor]));

            this.transforms[head] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[head]);
                
            this.transforms[left_eyebrow] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[left_eyebrow]);
                
            this.transforms[right_eyebrow] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[right_eyebrow]);
                
            this.transforms[left_eye] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[left_eye]);
                
            this.transforms[right_eye] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[right_eye]);
                
            this.transforms[top_beak] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[top_beak]);
                
            this.transforms[bottom_beak] = Mat4.translation([ 0,-this.scale_change * 4, 0])
                .times(this.transforms[bottom_beak]);
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0) {
            this.state.animating = false;
            this.body_angle = 0;
            this.scale_factor = 2.0;
        }

        this.animate_reset();
    }
}