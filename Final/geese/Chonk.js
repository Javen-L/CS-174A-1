// Chonk class
// This is a derived class for a Chonk,
// a chonky, high defense, low movement character.
class Chonk extends Goose {
    constructor(goose_id, x, z, orientation) { 
        super ( goose_id, x, z, orientation );
        this.stats.attack = 50;
        this.stats.defense = 50;
        this.stats.movement_range = 3;
        this.stats.attack_range = 1;

        let tag = '_' + this.constructor.name + this.stats.goose_id;
        let neck = 'neck' + tag;
        let body = 'body' + tag;
        let left_wing = 'left_wing' + tag;
        let right_wing = 'right_wing' + tag;
        let marker_strip = 'marker_strip' + tag;


        //Overwrite these initial transforms.
        this.transforms[neck]         = Mat4.identity().times(Mat4.translation([ -0.4, 0, 0])).times(Mat4.rotation( Math.PI/2, Vec.of(1,0,0))).times(Mat4.scale([ 1, 1, 0.8])); // 'neck'
        this.transforms[left_wing]    = Mat4.identity().times(Mat4.translation([ -7, -7.5,-3])).times(Mat4.scale([ 1.2, 1.2,-1.2])); // 'left_wing'
        this.transforms[body]         = Mat4.identity().times(Mat4.translation([ -6, -7.5, 3])).times(Mat4.scale([ 1, 1.3, 3])); // 'body'
        this.transforms[marker_strip] = Mat4.identity().times(Mat4.translation([-1,-2.625,0])).times(Mat4.rotation(Math.PI/14, Vec.of(0,0,1))).times(Mat4.translation([-3.2,0,0])).times(Mat4.scale([4, 0.01, 0.5])), //'marker_strip'
        this.transforms[right_wing]   = Mat4.identity().times(Mat4.translation([ -7, -7.5, 3])).times(Mat4.scale([ 1.2, 1.2, 1.2])); // 'right_wing''

        // Add 'attack_ball.'
        this.shapes['attack_ball' + '_' + this.constructor.name + goose_id] = new Subdivision_Sphere(4);
        this.transforms['attack_ball' + '_' + this.constructor.name + goose_id] = Mat4.translation([-4,-4.625,0]);
        this.colors['attack_ball' + '_' + this.constructor.name + goose_id] = 'white';

        this.head_pos = [0, 0];
        this.body_angle = 0;

        this.rot_factor = 0.0;
        this.ball_pos = 0.0;
        this.setup();
    }

    //New ball attack - 3 rotations before attack.
    attack = () => {
        this.animate_setup();

        let t_frames = 200;
        if (this.state.frameNumber == 0) {
            this.state.frameNumber = t_frames;
            this.rot_factor = 0.0;
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
        let attack_ball = 'attack_ball' + tag;

        let ball_factor = Math.pow(4.625, 1/60);
        let size_factor = Math.pow(4.625/3.5, 1/60);

        if (this.state.frameNumber == 120 && !this.state.game_over) {
            this.attack_sound.play();
        }

        if (this.state.frameNumber > t_frames * 18/20) {
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
        }
        else if (this.state.frameNumber > t_frames * 12/20) {
            this.transforms[attack_ball] = Mat4.translation([-4,-4.625,0])
                .times(Mat4.rotation(-this.rot_factor * Math.PI, Vec.of(0,0,1)))
                .times(Mat4.scale([ball_factor, ball_factor, ball_factor]))
                .times(Mat4.translation([4, 4.625, 0]))
                .times(this.transforms[attack_ball]);
                
            for (let t in this.transforms) {
                if (t != attack_ball) {
                    this.transforms[t] = Mat4.scale([1/size_factor, 1/size_factor, 1/size_factor])
                        .times(this.transforms[t]);
                }
                this.transforms[t] = Mat4.translation([-4, -4.625, 0])
                    .times(Mat4.rotation(-this.rot_factor * Math.PI, Vec.of(0,0,1)))
                    .times(Mat4.translation([4, 4.625, 0]))
                    .times(this.transforms[t]);
            }
            this.rot_factor += (0.2/59);
        }
        else if (this.state.frameNumber > t_frames * 10/20) {
            let new_ball_pos = this.ball_pos + 0.75;
            for (let t in this.transforms) {
                this.transforms[t] = Mat4.translation([-(4 - new_ball_pos), -4.625, 0])
                    .times(Mat4.rotation(-this.rot_factor * Math.PI, Vec.of(0,0,1)))
                    .times(Mat4.translation([4 - this.ball_pos, 4.625, 0]))
                    .times(this.transforms[t]);
            }
            this.ball_pos = new_ball_pos;
        }
        else if (this.state.frameNumber > t_frames * 8/20) {            
            let new_ball_pos = this.ball_pos - 0.75;
            for (let t in this.transforms) {
                this.transforms[t] = Mat4.translation([-(4 - new_ball_pos), -4.625, 0])
                    .times(Mat4.rotation(this.rot_factor * Math.PI, Vec.of(0,0,1)))
                    .times(Mat4.translation([4 - this.ball_pos, 4.625, 0]))
                    .times(this.transforms[t]);
            }
            this.ball_pos = new_ball_pos;

            this.state.inflict_damage_other = (this.state.frameNumber == t_frames / 2);
        }
        else if (this.state.frameNumber > t_frames * 2/20) {
            this.rot_factor -= (0.2/59);
            
            this.transforms[attack_ball] = Mat4.translation([-4,-4.625,0])
                .times(Mat4.rotation(this.rot_factor * Math.PI, Vec.of(0,0,1)))
                .times(Mat4.scale([1/ball_factor, 1/ball_factor, 1/ball_factor]))
                .times(Mat4.translation([4, 4.625, 0]))
                .times(this.transforms[attack_ball]);
            
            for (let t in this.transforms) {
                this.transforms[t] = Mat4.translation([-4, -4.625, 0])
                    .times(Mat4.rotation(this.rot_factor * Math.PI, Vec.of(0,0,1)))
                    .times(Mat4.translation([4, 4.625, 0]))
                    .times(this.transforms[t]);

                if (t != attack_ball) {
                    this.transforms[t] = Mat4.scale([size_factor, size_factor, size_factor])
                        .times(this.transforms[t]);
                }
            }
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
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0) {
            this.state.animating = false;
            this.rot_factor = 0.0;
        }

        this.animate_reset();
    }
    

    //Standard honk-like chonk attack.
    /*
    standard = () => {
        let t_frames = 140;
        if (this.state.frameNumber == 0) {
            this.state.frameNumber = t_frames;
            this.head_pos = [0, 0];
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
            
        let body_down_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));
        let body_up_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));

        if (this.state.frameNumber > t_frames * 12/14) {
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

            this.transforms[neck] = body_down_transform
                .times(this.transforms[neck]);
            
            this.body_angle += Math.PI / 100 / 2.25;

            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-3]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,3]))
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
                .times(Mat4.translation([ -7,-4.5,3]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-3]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_down_transform)
                .times(this.transforms[right_wing]);
        }
        else if (this.state.frameNumber > t_frames * 5/14) {
            ;
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
             
            this.transforms[neck] = body_up_transform
                .times(this.transforms[neck]);

            this.body_angle -= Math.PI / 100 / 2.25;
                        
            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-3]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,3]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_up_transform)
                .times(this.transforms[left_wing]);    

            this.transforms[body] = body_up_transform
                .times(this.transforms[body]);

            this.transforms[right_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,3]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-3]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_up_transform)
                .times(this.transforms[right_wing]);
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
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0) {
            this.state.animating = false;
            this.head_pos = [0, 0];
            this.body_angle = 0;
        }
    }
    */

    flap = () => {
        let t_frames = 100;
        if (this.state.frameNumber == 0)
            this.state.frameNumber = t_frames;

        let left_wing = 'left_wing' + '_' + this.constructor.name + this.stats.goose_id;
        let right_wing = 'right_wing' + '_' + this.constructor.name + this.stats.goose_id;
        if (this.state.frameNumber > t_frames/2) {
            let adjustment = 0.1 * (100 - this.state.frameNumber);
            this.transforms[left_wing] = Mat4.translation([ -7,-4.5 + adjustment,3])
                .times(Mat4.rotation(-Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,-3]))
                .times(this.transforms[left_wing]);
            this.transforms[right_wing] = Mat4.translation([ -7,-4.5 + adjustment,-3])
                .times(Mat4.rotation(Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,3]))
                .times(this.transforms[right_wing]);
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0.1,0.1,0]).times(this.transforms[shape]);
            }
        }
        else {
            let adjustment = 0.1 * this.state.frameNumber;
            this.transforms[left_wing] = Mat4.translation([ -7,-4.5 + adjustment,3])
                .times(Mat4.rotation(Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,-3]))
                .times(this.transforms[left_wing]);
            this.transforms[right_wing] = Mat4.translation([ -7,-4.5 + adjustment,-3])
                .times(Mat4.rotation(-Math.PI / t_frames, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5 - adjustment,3]))
                .times(this.transforms[right_wing]);
            for (let shape in this.transforms) {
                this.transforms[shape] = Mat4.translation([0.1,-0.1,0]).times(this.transforms[shape]);
            }
        }

        this.state.frameNumber--;
        if (this.state.frameNumber == 0)
            this.state.animating = false;
    }
}