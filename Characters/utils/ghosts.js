

function getDistance(pacman, ghost){
    return Math.sqrt(Math.pow(pacman.x - ghost.x, 2) + Math.pow(pacman.y - ghost.y, 2))
}

//Dado una tilePose (target) y la direccion actual y posicion actual -> obtener la tilePose que me lleve a ese tile!
//Dado un x, y devolver una tilePose 


