// Class for generating the tiles for the map based on a matrix containing values for what type of tile exists
class Tile_Generator {
    constructor(context) {
        this.tiles_files = [
            {texture: "assets/tile_map.png", bump: "assets/bump_map.png"},  // 0
        ];
        // Generate map such that the first row is the topmost row of tiles in worldspace
        // Since we generate tiles starting from (0,0,0) (which is the first value in the Row 1 array)
        // Grass : 0, Stone : 1, Dirt: 2
        // Can addd more later
        this.map = 
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 20
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 19
            [1, 1, 0, 0, 0 ,0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1],  // Row 18
            [1, 1, 0, 0, 0 ,0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 1, 1],  // Row 17
            [1, 1, 0, 1, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1],  // Row 16
            [1, 1, 0, 1, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1],  // Row 15
            [1, 1, 0, 1, 0 ,0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 1, 2, 2, 1, 1],  // Row 14
            [1, 1, 0, 1, 1 ,1, 0, 2, 0, 0, 0, 0, 2, 2, 0, 1, 2, 2, 1, 1],  // Row 13
            [1, 1, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],  // Row 12
            [1, 1, 0, 2, 2 ,2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],  // Row 11
            [1, 1, 0, 2, 2 ,2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],  // Row 10
            [1, 1, 0, 0, 2 ,1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],  // Row 9
            [1, 1, 0, 0, 2 ,1, 1, 1, 0, 0, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1],  // Row 8
            [1, 1, 0, 0, 2 ,1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1],  // Row 7
            [1, 1, 0, 0, 0 ,1, 1, 1, 2, 2, 2, 1, 0, 0, 2, 2, 2, 2, 1, 1],  // Row 6
            [1, 1, 0, 0, 0 ,0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 0, 1, 1],  // Row 5
            [1, 1, 0, 0, 0 ,0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1],  // Row 4
            [1, 1, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],  // Row 3
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 2
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // Row 1
        ];
        // load the tile textures with their bump maps (if available)
        this.load_tile_texture(context);
    }

    load_tile_texture(context) {
        this.tile_material = context.get_instance( Bump_Shader ).material(Color.of(0,0,0,1),
            {ambient: 1,
                texture: context.get_instance(this.tiles_files[0].texture, true),
                bump_texture: context.get_instance(this.tiles_files[0].bump, true),
            });
    }

    // Called to draw the arena
    render_tiles(tile_shape, graphics_state) {
        tile_shape.draw(graphics_state, Mat4.identity(), this.tile_material );
    }
}

window.Arena = window.classes.Arena =
class Arena extends Shape    // A arena inserts square strips into its arrays
{ constructor(map, tile_length, tile_width)  
    { super( "positions", "normals", "texture_coords" );
        let tile_transform_init = Mat4.scale([tile_length / 2.0, 1, tile_width / 2.0]).times(Mat4.rotation(Math.PI / 2, Vec.of(-1,0,0)));
        for (let i = map.length - 1; i >= 0; i--) {
            for (let j = 0; j < map[i].length; j++) {
                let map_index = map[i][j];
                let tile_transform = Mat4.translation([j * tile_width + tile_width / 2.0, 0, -((map.length - i - 1) * tile_length + tile_length / 2.0)]).times(tile_transform_init);
                if (map_index == 0) {
                    Square1.insert_transformed_copy_into( this, [], tile_transform );
                }
                else if (map_index == 1) {
                    Square2.insert_transformed_copy_into( this, [], tile_transform );
                } else {
                    Square3.insert_transformed_copy_into(this, [], tile_transform);
                }
            }
        }
    }
}

// Square shapes corresponding to the texture inside the map (top left is 1, top right is 2, bottom left is 3, bottom right is 4)
window.Square1 = window.classes.Square1 =
class Square1 extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior 
                                        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
{                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals, 
  constructor()                         // etc) smaller and more cache friendly.
    { super( "positions", "normals", "texture_coords" );                                   // Name the values we'll define per each vertex.
      this.positions     .push( ...Vec.cast( [-1,-1,0], [1,-1,0], [-1,1,0], [1,1,0] ) );   // Specify the 4 square corner locations.
      this.normals       .push( ...Vec.cast( [0,0,1],   [0,0,1],  [0,0,1],  [0,0,1] ) );   // Match those up with normal vectors.
      this.texture_coords.push( ...Vec.cast( [0,0.51],     [0.49,0.51],    [0,1],    [0.49,1]   ) );   // Draw a square in texture coordinates too.
      this.indices       .push( 0, 1, 2,     1, 3, 2 );                   // Two triangles this time, indexing into four distinct vertices.
    }
}

window.Square2 = window.classes.Square2 =
class Square2 extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior 
                                        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
{                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals, 
  constructor()                         // etc) smaller and more cache friendly.
    { super( "positions", "normals", "texture_coords" );                                   // Name the values we'll define per each vertex.
      this.positions     .push( ...Vec.cast( [-1,-1,0], [1,-1,0], [-1,1,0], [1,1,0] ) );   // Specify the 4 square corner locations.
      this.normals       .push( ...Vec.cast( [0,0,1],   [0,0,1],  [0,0,1],  [0,0,1] ) );   // Match those up with normal vectors.
      this.texture_coords.push( ...Vec.cast( [0.51,0.51],     [1,0.51],    [0.51,1],    [1,1]   ) );   // Draw a square in texture coordinates too.
      this.indices       .push( 0, 1, 2,     1, 3, 2 );                   // Two triangles this time, indexing into four distinct vertices.
    }
}

window.Square3 = window.classes.Square3 =
class Square3 extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior 
                                        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
{                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals, 
  constructor()                         // etc) smaller and more cache friendly.
    { super( "positions", "normals", "texture_coords" );                                   // Name the values we'll define per each vertex.
      this.positions     .push( ...Vec.cast( [-1,-1,0], [1,-1,0], [-1,1,0], [1,1,0] ) );   // Specify the 4 square corner locations.
      this.normals       .push( ...Vec.cast( [0,0,1],   [0,0,1],  [0,0,1],  [0,0,1] ) );   // Match those up with normal vectors.
      this.texture_coords.push( ...Vec.cast( [0,0],     [0.49,0],    [0,0.49],    [0.49,0.49]   ) );   // Draw a square in texture coordinates too.
      this.indices       .push( 0, 1, 2,     1, 3, 2 );                   // Two triangles this time, indexing into four distinct vertices.
    }
}


// Bump map code from my assignment 4 (Betto Cerrillos 004965272)
class Bump_Shader extends Phong_Shader {
    update_GPU(g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl)
    {
      super.update_GPU(g_state, model_transform, material, gpu, gl);
      // Check to see if there is a second texture
      // Assume the other texture material is already loaded in.
      if (material.bump_texture)
      {
        // Load in the bump texture into the GPU into the proper locations
        gl.uniform1i(gpu.texture_loc, 0);
        gl.uniform1i(gpu.bump_texture_loc, 1);
  
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, material.bump_texture.id);
        gl.activeTexture(gl.TEXTURE0);  // Do this to prevent other textures from getting incorrect images
      }
    }
  
    fragment_glsl_code()
    {
      return `
      uniform sampler2D texture;
      uniform sampler2D bump_texture;

      void main()
      { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
        { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
          return;
        }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                          // Phong shading is not to be confused with the Phong Reflection Model.

        vec4 tex_color = texture2D( texture, f_tex_coord );
        vec4 bump_color =  texture2D(bump_texture, f_tex_coord );                   // Sample the texture image in the correct place.
        vec3 bump_normal = 2.0 * (bump_color.xyz - vec3(0.5, 0.5, 0.5));              // Obtain the normal vector encoded in bump map.
                                                                                    // Compute an initial (ambient) color:
        if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
        else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
        // Include the added bump normal to the current normal.
        gl_FragColor.xyz += phong_model_lights( normalize( N  + bump_normal) );  // Compute the final color with contributions from lights.
      }`;
    }
  }