// Honk class
// This is a derived class for your standard Honk,
// a basic, well-rounded character
class Honk extends Goose {
    constructor(goose_id, x, z, orientation) { 
        super ( goose_id, x, z, orientation );
        this.stats.attack = 75;
        this.stats.defense = 25;
        this.stats.movement_range = 6;
        this.stats.attack_range = 1;
        
        this.head_pos = [0, 0];
        this.body_angle = 0;
        this.setup();
    }

    attack = () => {
        this.animate_setup();
        
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
        let marker_strip = 'marker_strip' + tag;
        
        let neck_down_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(-Math.PI / 100 / 1.5, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
        let neck_up_transform = Mat4.translation([-0.4, -4, 0]) // move neck independently
            .times(Mat4.rotation(Math.PI / 100 / 1.5, Vec.of(0,0,1)))
            .times(Mat4.translation([0.4,4,0]));
            
        let body_down_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(-Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));
        let body_up_transform = Mat4.translation([-4,-6.75, 0]) // move neck with body
            .times(Mat4.rotation(Math.PI / 100 / 2.25, Vec.of(0,0,1)))
            .times(Mat4.translation([4,6.75,0]));

        if (this.state.frameNumber == 90 && !this.state.game_over) {
            this.attack_sound.play();
        }
        
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
                .times(neck_down_transform)
                .times(this.transforms[head]);

            let new_head_pos = body_down_transform.times(neck_down_transform).times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
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
                .times(neck_down_transform)
                .times(this.transforms[neck]);
            
            this.body_angle += Math.PI / 100 / 2.25;

            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
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
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
                .times(Mat4.translation([-4,-6.75, 0]))
                .times(Mat4.rotation(this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(body_down_transform)
                .times(this.transforms[right_wing]);
        }
        else if (this.state.frameNumber > t_frames * 5/14) {
            this.state.inflict_damage_other = (this.state.frameNumber == t_frames / 2);
        }
        else if (this.state.frameNumber > t_frames * 2/14) {
            this.transforms[head] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[head]);
            
            let new_head_pos = neck_up_transform.times(body_up_transform).times(Vec.of(this.head_pos[0],this.head_pos[1],0,1));
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
             
            this.transforms[neck] = neck_up_transform
                .times(body_up_transform)
                .times(this.transforms[neck]);
            
            this.body_angle -= Math.PI / 100 / 2.25;
            
            this.transforms[left_wing] = Mat4.translation([-4,-6.75, 0])
                .times(Mat4.rotation(-this.body_angle, Vec.of(0,0,1)))
                .times(Mat4.translation([4,6.75,0]))
                .times(Mat4.translation([ -7,-4.5,-1]))
                .times(Mat4.rotation(-Math.PI / 100 / 0.6, Vec.of(1,0,0)))
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
                .times(Mat4.rotation(Math.PI / 100 / 0.6, Vec.of(1,0,0)))
                .times(Mat4.translation([ 7,4.5,-1]))
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

        this.animate_reset();
    }
}