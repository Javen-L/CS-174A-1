//Name: Jorge Pineda
//UID: 204971366
window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,5 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.

        const shapes = { box:   new Cube( 1 ),
                         box_2: new Cube( 2 ),
                         axis:  new Axis_Arrows(),
                         custom: new Custom()
                       }
        this.submit_shapes( context, shapes );

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when 
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials =
          { 
            phong: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ) , { ambient: 0.2}),
            me:    context.get_instance( Texture_Scroll_X ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/me.jpg", false ) }),
            flor:  context.get_instance( Texture_Rotate ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance( "assets/flor.jpg", true ) }),
            bump:  context.get_instance( Texture_Bump ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture_1: context.get_instance( "assets/regular.jpg"), texture_2: context.get_instance( "assets/normal.jpg") })
          }

        this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

        // TODO:  Create any variables that needs to be remembered from frame to frame, such as for incremental movements over time.
        this.angle = [ 0.0 , 0.0 ];
      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
        this.key_triggered_button( "Rotate cubes", [ "c" ], () => {
            this.rotateFlag = !this.rotateFlag;
        });
        
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        if (this.rotateFlag) {
            this.angle[0] = this.angle[0] + Math.PI * dt;
            this.angle[1] = this.angle[1] + (2/3) * Math.PI * dt;
        }
        
        // TODO:  Draw the required boxes. Also update their stored matrices.
        this.shapes.box.draw( graphics_state, Mat4.translation([-2, 0, 0]).times(Mat4.rotation(this.angle[0], Vec.of( 1, 0, 0))), this.materials.me );
        this.shapes.box_2.draw( graphics_state, Mat4.translation([2, 0, 0]).times(Mat4.rotation(this.angle[1], Vec.of( 0, 1, 0))), this.materials.flor );
        this.shapes.custom.draw( graphics_state, Mat4.translation([0, -2, 0]), this.materials.phong );
        this.shapes.box.draw( graphics_state, Mat4.translation([0, 2, 0]), this.materials.bump );
      }
  }

class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.

          vec2 new_coord = f_tex_coord;
          new_coord.x += mod(2.0 * animation_time, 2.0);
          vec4 tex_color = texture2D( texture, new_coord );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

class Texture_Rotate extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.

          vec2 new_coord = f_tex_coord;
          float angle = mod(0.5 * 3.1416 * animation_time, 2.0 * 3.1416);
          new_coord.x = 1.0 + (f_tex_coord.x - 1.0) * cos( angle ) - (f_tex_coord.y - 1.0) * sin( angle );
          new_coord.y = 1.0 + (f_tex_coord.x - 1.0) * sin( angle ) + (f_tex_coord.y - 1.0) * cos( angle );
          vec4 tex_color = texture2D( texture, new_coord );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

class Texture_Bump extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      return `
        uniform sampler2D texture_1;
        uniform sampler2D texture_2;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.

          vec4 tex_1_color = texture2D( texture_1, f_tex_coord);  
          vec4 tex_2_color = texture2D( texture_2, f_tex_coord); 
                      
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_1_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_1_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( normalize( N + vec3(2.0, 2.0, 2.0) * tex_2_color.xyz - vec3(1.0, 1.0, 1.0)) );
        }`;
    }
     // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
    {                              // First, send the matrices to the GPU, additionally cache-ing some products of them we know we'll need:
      this.update_matrices( g_state, model_transform, gpu, gl );
      gl.uniform1f ( gpu.animation_time_loc, g_state.animation_time / 1000 );

      if( g_state.gouraud === undefined ) { g_state.gouraud = g_state.color_normals = false; }    // Keep the flags seen by the shader 
      gl.uniform1i( gpu.GOURAUD_loc,        g_state.gouraud || material.gouraud );                // program up-to-date and make sure 
      gl.uniform1i( gpu.COLOR_NORMALS_loc,  g_state.color_normals );                              // they are declared.

      gl.uniform4fv( gpu.shapeColor_loc,     material.color       );    // Send the desired shape-wide material qualities 
      gl.uniform1f ( gpu.ambient_loc,        material.ambient     );    // to the graphics card, where they will tweak the
      gl.uniform1f ( gpu.diffusivity_loc,    material.diffusivity );    // Phong lighting formula.
      gl.uniform1f ( gpu.specularity_loc,    material.specularity );
      gl.uniform1f ( gpu.smoothness_loc,     material.smoothness  );

      if( material.texture_1 && material.texture_2 )                           // NOTE: To signal not to draw a texture, omit the texture parameter from Materials.
      { gpu.shader_attributes["tex_coord"].enabled = true;
        gl.uniform1f ( gpu.USE_TEXTURE_loc, 1 );
        gl.uniform1i ( gpu.texture_2_loc, 1 );

        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture  ( gl.TEXTURE_2D, material.texture_1.id );
        gl.activeTexture( gl.TEXTURE1 );
        gl.bindTexture  ( gl.TEXTURE_2D, material.texture_2.id );

        gl.activeTexture( gl.TEXTURE0 );
      }
      else  { gl.uniform1f ( gpu.USE_TEXTURE_loc, 0 );   gpu.shader_attributes["tex_coord"].enabled = false; }

      if( !g_state.lights.length )  return;
      var lightPositions_flattened = [], lightColors_flattened = [], lightAttenuations_flattened = [];
      for( var i = 0; i < 4 * g_state.lights.length; i++ )
        { lightPositions_flattened                  .push( g_state.lights[ Math.floor(i/4) ].position[i%4] );
          lightColors_flattened                     .push( g_state.lights[ Math.floor(i/4) ].color[i%4] );
          lightAttenuations_flattened[ Math.floor(i/4) ] = g_state.lights[ Math.floor(i/4) ].attenuation;
        }
      gl.uniform4fv( gpu.lightPosition_loc,       lightPositions_flattened );
      gl.uniform4fv( gpu.lightColor_loc,          lightColors_flattened );
      gl.uniform1fv( gpu.attenuation_factor_loc,  lightAttenuations_flattened );
    }
}