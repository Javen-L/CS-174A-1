# A Geese Game

## Due: December 1, 2019 at 11:50pm
Created By: Benjamin Bach (404933137), Betto Cerrillos (004965272), Jorge Pineda (204971366)

### Overview:
Two teams of geese must battle for control of the land. The game involves two players controlling their respective team of geese and is played in an arena made up of grass, dirt and stone tiles, where each team begins on opposite sides of the field. There are 6 different geese flavors and a team of geese is comprised of a specific number of each character type of these geese:
- Honk (x4): Basic, well-rounded, scout.
- Lonk (x2): Has longer neck for longer range attacks.
- Stronk (x2): Has thick, muscular legs for more powerful attacks, at the cost of lesser movement.
- Chonk (x2): Chonky, which gives it higher defense ability at the cost of lesser movement and lesser attack.
- Sonk (x1): Has musical attack.
- Monk (x1): Has magic attack with extensive range, low defense and normal movement.

A chart with exact numbers for all our goose statistics (health points, attack, defense, movement range, attack range) is included at the end of this section.
The game is turn-based upon which each side has the ability to act with all units before proceeding to the opponent’s turn. Each goose unit moves in a tile-based pattern and can attack any enemy unit in range. The goal is to defeat all the enemy units before losing all your units.
The game is a 3D game with chess-like elements, but once a unit initiates an attack with an enemy unit, it zooms in and does a little battle simulation between the two units with nice animations in which the initiating unit first attacks and the enemy unit can then retalliate with its own attack, if its attack range allows it to. Damage value taken by the defending unit is calculated as the attacking unit's attack value minus the defending unit's defense value.

### How to Play
The game starts with the red team and switches to the blue team once the player has moved all their geese or they manually end the turn by pressing the bottom on the top right of the screen. 

#### Mouse and Goose Movement
A yellow marker tile appears above the tile the user's mouse is currently hovering above. Users can then hover above a tile a goose on their team is standing on and left mouse click them to select them. Selecting a goose spawns blue movement tiles that indicate the location the goose can move to (including moving in place if they click on themselves). After clicking on a blue tile to move to that location, a menu pops up on the left that allows them to take actions: either to attack, wait (ending the goose's action turn), or go back (which places the goose back to their position at the beginning of the turn to move again).

![Goose Move](https://media.giphy.com/media/cgfGtIi1jrmKpUblJn/giphy.gif)

Geese can move on the dirt and grass tiles, but are unable to move through the stone tiles. Geese can also block other geese, so position of your own geese is very important as you not only block the enemy, but may also block yourself!

#### Attacking
After moving, selecting the Attack option from the action menu spawns red attack tiles around the gooose, which indicate their attack range. Any enemy goose standing on these red tiles can be selected, which initiates a cool battle sequence between them. At the end of the attack sequence, the goose cannot be selected again for another action for the rest of the turn.

![Goose Attack](https://media.giphy.com/media/QyhRS4svqSXXAlfbeT/giphy.gif)

Attacking does not come without its own consequences, attacking a goose within its own attack range allows the enemy goose to also attack you after you attack it. Take advantage of your ranged geese!

During the attack selection, hovering above an enemy unit shows a battle broadcast that indicates how much damage each geese will deal each other. For example, the blue menu shows the damage the goose in the blue team will deal to the enemy, and the bar shows how much hp will be lost if it attacks the other goose. So make a wise attack!

#### The End Goal
Each team must battle one another until no geese are left on the opposing team. The team that defeats all the other team's geese wins the game!

#### Statistics
| Character | Health | Attack | Defense | Movement Range | Attack Range |
| ------- | ----- | ------ | ------- | ------- | ------- |
| Honk | 100 | 75 | 25 | 6 | 1 |
| Lonk | 100 | 75 | 25 | 4 | 2 |
| Stronk | 100 | 125 | 25 | 4 | 1 |
| Chonk | 100 | 50 | 50 | 3 | 1 |
| Sonk | 100 | 75 | 25 | 3 | 1 |
| Monk | 100 | 100 | 0 | 3 | 3 |


### Individual Tasks:
#### Benjamin Bach:
I contributed to this project mainly in terms of laying out the structure of the game as well as implementing a lot of the logic behind it. My main work was creating the class structure/inheritance structure of each Goose class and how to structure them in a way to have them have elements of traditional OOP concepts as well as being able to be animated inside the scene. This was taken care of mostly arrays/maps contained in each Goose class, and then would be instantiated in the scene to be handled. I also implemented the movement-tile algorithm (DFS) and also took care of moving the geese around the map, including their animation. 
Speaking of animation, I worked on how animations were to be managed such that coordination was easy and simple, especially in a game environment where animations may be started by the user. The implementation I found out to work best was to use frames, such that each call of display() would animate one frame of whatever function was called (move/attack).
Finally, I implemented most of the game logic, including players turns, geese deaths and removal, and when a player wins.

#### Betto Cerrillos:
For this project I implemented the bump mapping (based on my assignment 4 code) and the mouse picking (by transforming backwards from screen coordinates
to world space). I also implemented screen to texture rendering by using renderbuffers and framebuffers to save the current frame and then run shaders on
them (multipass-rendering) such as the radial blur during the camera zoom or the monk attack. I also implemented the tile class that renders the appropriate
tiles at their appropriate locations based on a 2D array indicating tile placement. I also worked on implementing smooth camera movements and integrating
the battle animations into one sequence with camera movement.
I also worked on organizing the tile textures and writing shader code for effects (like radial blur and the negative effect) that make the battles more
intense. In terms of data structures, I worked with arrays and matrices to keep track of several elements of an object (like the tiles or several UI elements). I also worked with maps to keep easy access to certain elements of an object (goose to audio sources).

#### Jorge Pineda:
My main work on the project was comprised of creating all our goose character models, and attack animations. I used a lot of matrix math in order to compose new shapes in our dependencies to use in these models, and to ensure that these looked appropriate with the lights sources we applied. Additionally, all within the model's space, I had to position the shapes correctly with respect to each other and ensure they interacted with the correct transformations during our animations which is definitely where most of my time was spent, putting all that logic together. These transformation states/shapes were generally stored in data structures such as arrays and maps.
Following that process, I did also work on a chunk of the game mechanics as was deemed necessary for the team, some logic with the menu buttons for example, but mostly to tasks related to the attack animations. A couple of these tasks were to line up battle damage logic/effect and sound effects to the appropriate frames in our animations, and also generally check that the attack animations involving contact (i.e. the Chonk body roll) were accurate and looked good.



### Citations:

#### [Quaternion.js](https://github.com/infusion/Quaternion.js)
This class was written by the user above, provides an interface to use Quaternions for calculations.

#### utility.js:
[function calculate_click_ray_2](https://stackoverflow.com/questions/20140711/picking-in-3d-with-ray-tracing-using-ninevehgl-or-opengl-i-phone/20143963#20143963)

Followed this StackOverflow question to implement picking with the tile selection.

[function calculate_click_ray](http://antongerdelan.net/opengl/raycasting.html)

Original implementation  for picking that uses a method similar to the one above.

#### tile-generator.js
Refer to Betto Cerrillos’ HW4 Bump map implementation (HW4)

#### dependencies.js: 
[class Radial_Blur_Shader/Multi](https://stackoverflow.com/questions/4579020/how-do-i-use-a-glsl-shader-to-apply-a-radial-blur-to-an-entire-scene)

Shader code for creating the radial blur effect when zooming in and out of battles.

#### tiny-graphics.js:

[class Canvas_Manager](https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html)

Followed tutorial to get the rendering to texture to allow for multipass rendering.
