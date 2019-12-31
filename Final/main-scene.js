window.Game_Scene = window.classes.Game_Scene =
class Game_Scene extends Scene_Component { 

  constructor(context, control_box) {     // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box );    // First, include a secondary Scene that provides movement controls:
    if(!context.globals.has_controls) 
      context.register_scene_component(new Movement_Controls( context, control_box.parentElement.insertCell())); 

    context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 10,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
    this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );
    // Add a canvas listener for picking
    this.click_ray = undefined;
    context.canvas.addEventListener( "mousedown", e => { e.preventDefault();
       this.click_ray = calculate_click_ray_2(e, context.globals.graphics_state.camera_transform, context.globals.graphics_state.projection_transform, context.canvas); } );

    const r = context.width/context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );
    const shapes = {
                         arena: new Square(),
                         menu_quad: new Square(),
                         text_line: new Text_Line(2),
                   }
    // instantiate geese
    this.geese = {
      g1: new Chonk(1,0,0,0),
      // g2: new Goose(2),
    }

    // add all shapes used by geese to shapes
    for (let g in this.geese) {
      for (let shape in this.geese[g].shapes) {
        shapes[shape] = this.geese[g].shapes[shape];
      }
    }

    this.submit_shapes( context, shapes);
    this.context = context.gl;
    this.canvas = context.canvas;
    // Initialize for multi-pass rendering gotten from the Encyclopedia of Code
    this.scratchpad = document.createElement('canvas');
    // A hidden canvas for multi-pass rendering:
    // Since we can only use powers of 2 for a texture, use the closest canvas resolution
    this.scratchpad_context = this.scratchpad.getContext('2d');
    this.scratchpad.width   = 1024;
    this.scratchpad.height  = 512;
    // Save the image somewhere temporarily
    this.fb_texture = new Texture(context.gl, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", true );
    this.materials =
      { white:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:.5 } ),
        black:     context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient:.5 } ),
        orange:    context.get_instance( Phong_Shader ).material( Color.of( 1,.7,.4,1 ), { ambient:.5 } ),
        red:       context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,1 ), {ambient: .5} ),
        green:     context.get_instance( Phong_Shader ).material( Color.of(.2,.5,.2,1 ), {ambient: .5} ),
        gold:      context.get_instance( Phong_Shader ).material( Color.of(.7,.4,.2,1), {ambient: .5}),
        gray:      context.get_instance( Phong_Shader ).material( Color.of(.5,.5,.5,1), {ambient: .5}),
        text_image: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1),
          {ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/text.png", true)}),
        menu_image: context.get_instance( Phong_Shader ).material( Color.of(1,1,0,1), {ambient: 1, diffusivity: 0, specularity: 0}),  // Material for menu objects
        radial_blur_material: context.get_instance(Radial_Blur_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: this.fb_texture}),
        // negative_material: context.get_instance(Negative_Shader).material(Color.of(0,0,0,1), {ambient: 1, texture: this.fb_texture}),
        negative_material: {shader: context.get_instance(Negative_Shader)},
        radial_simple: {shader: context.get_instance(Radial_Blur_Shader_Multi)},
      }

      // this.lights = [ new Light( Vec.of( 10,-15,10,1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];
      this.lights = [ new Light( Vec.of( 0,0,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      this.arena_transform = Mat4.scale([30,1,30]).times(Mat4.rotation(Math.PI / 2, Vec.of(1,0,0)));
      
      // This setup trigger to activate camera zoom in whenever in the game.
      // TODO: Remove the trigger once the battle system is setup.
      this.setup_trigger = 0;
      this.camera_animation_manager = new Camera_Animations_Manager();
      this.battle_scene_manager = new Battle_Scene_Manager();
      let menu_transform_1 =Mat4.translation([0.02,0.02,-0.11]).times(Mat4.scale([0.01, 0.007, 1]));
      let text_transform_1 = Mat4.translation([-0.5,0,0.001]).times(Mat4.scale([0.15,0.5,1]));
      let menu_transform_2 = Mat4.translation([0.02,-0.02,-0.11]).times(Mat4.rotation(Math.PI/4,Vec.of(0,0,-1)).times(Mat4.scale([0.01, 0.007, 1])));
      let text_transform_2 = Mat4.translation([-0.5,0,0.001]).times(Mat4.scale([0.15,0.5,1]));
      let menu_obj = {menu_transform: menu_transform_1, menu_material: this.materials.menu_image, tag: "menu 1", text: "hello", text_transform: text_transform_1,  clickable: true};
      let menu_obj2 = {menu_transform: menu_transform_2, menu_material: this.materials.menu_image, tag: "menu 2", text: "honk", text_transform: text_transform_2,  clickable: true};
      this.menu_manager = new Menu_Manager([/*menu_obj, menu_obj2*/], this.shapes.menu_quad, this.shapes.text_line, this.materials.text_image);
      this.screen_quad_transform = Mat4.translation([0,0,-0.1]).times(Mat4.scale([0.075,.042,1]));  // Transform for quad that appears in front of camera for multi-pass
      this.enable_multi = false;
      this.init_shader_trigger = false;
    }

  make_control_panel() {           // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements. 
    this.key_triggered_button("Flap em", ["q"], () => this.geese['g1'].state.animating = !this.geese['g1'].state.animating);
    this.key_triggered_button("Camera and action!", ["1"], () => this.setup_trigger = 1);
    this.key_triggered_button("Disable/Enable menus", ["4"], () => this.menu_manager.enabled = !this.menu_manager.enabled);
  }

  display( graphics_state ) { 
    graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

    this.geese['g1'].state.animating = true;
    for (let g in this.geese) {
      if(this.geese[g].state.animating) {
        this.geese[g].attack();
      }
      for (let shape in this.geese[g].shapes) {
        // this.shapes[shape].draw(graphics_state, Mat4.rotation(-Math.PI / 2, Vec.of(0,1,0)).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
        this.shapes[shape].draw(graphics_state, this.geese[g].transforms[shape], this.materials[this.geese[g].colors[shape]]);
       }
     }

    if (this.setup_trigger == 1) {
      this.battle_scene_manager.initiate_battle_sequence(this.geese['g1'], this.geese['g2'], undefined, this.camera_animation_manager);
      this.setup_trigger = 0;
    }

    if (this.battle_scene_manager.battle_ongoing) {
      graphics_state.camera_transform = this.battle_scene_manager.animate_battle(graphics_state, this.context);
    }

    // this.geese['g1'].state.animating = true;
    /*
    for (let g in this.geese) {
      // if(this.geese[g].state.animating) {
      //   this.geese[g].attack();
      // }
      for (let shape in this.geese[g].shapes) {
        // this.shapes[shape].draw(graphics_state, Mat4.rotation(-Math.PI / 2, Vec.of(0,1,0)).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
        let world_offset = calculate_world_pos_from_tile(this.geese[g].tile_position.x,this.geese[g].tile_position.z,10,10); 
        this.shapes[shape].draw(graphics_state, Mat4.translation([4.25 + world_offset[0],9.35,world_offset[2]]).times(this.geese[g].transforms[shape]), this.materials[this.geese[g].colors[shape]]);
      }
    }*/

    this.menu_manager.update_transforms(graphics_state.camera_transform);

    // Check collisions
    if (this.click_ray) {
      //console.log(this.click_ray);
      //console.log(this.menu_manager.check_collisions(this.click_ray));
      this.click_ray = undefined;
    }

    // Draw arena
    this.shapes.arena.draw(graphics_state, Mat4.translation([ 0, -9.35, 0]).times(this.arena_transform), this.materials.green);
    // Then draw other stuff (Menu stuff, debugging)
    this.menu_manager.draw_menus(graphics_state, this.context);

    
    // if (this.camera_animation_manager.animation_type != 0) {
    //   // Multi-pass rendering for radial blur if camera is zooming in/out
    //   // Draw image to hidden canvas
    //   this.scratchpad_context.drawImage( this.canvas, 0, 0, 1024, 512 );
    //   this.result_img = this.scratchpad.toDataURL("image/png");
    //                               // Don't call copy to GPU until the event loop has had a chance
    //                               // to act on our SRC setting once:
    //   if( this.skipped_first_frame )
    //                                                   // Update the texture with the current scene:
    //       this.fb_texture.image.src = this.result_img;
    //   this.skipped_first_frame = true;
    //   // Start over on a new drawing, never displaying the prior one:
    //   this.context.clear( this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    //   // Draw the quad in front of camera with new texture
    //   let final_transform = Mat4.inverse(graphics_state.camera_transform).times(this.screen_quad_transform);
    //   this.shapes.menu_quad.draw(graphics_state, final_transform, this.materials.radial_blur_material);
    // }

    if (this.geese['g1'].animate_shader && !this.init_shader_trigger) {
      this.enable_multi = true;
      this.init_shader_trigger = true;
      this.materials.negative_material.shader.initial_animation_time = graphics_state.animation_time;
    }
    else if (!this.geese['g1'].animate_shader && this.init_shader_trigger) {
      this.enable_multi = false;
      this.init_shader_trigger = false;
    }

    graphics_state.multipass.enabled = this.enable_multi;
    graphics_state.multipass.shape = this.shapes.menu_quad;
    graphics_state.multipass.material = this.materials.negative_material; 
    
  }
}

