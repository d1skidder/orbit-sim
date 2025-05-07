// constants
enum Constants {
    gravity = 6.67430e-11,
    time_update = 10000,
    scaler = 1e-10,
}
const canvas = document.getElementById("ctx") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

console.log("yes", canvas, ctx)

interface PlanetaryBody {
    x: number;
    y: number;
    x_vel: number;
    y_vel: number;
    mass: number;
    scale?: number;
}

class Planet implements PlanetaryBody {
    public x: number;
    public y: number;
    public x_vel: number;
    public y_vel: number;
    public mass: number;

    public scale?: number;

    constructor(x: number, y: number, mass: number, scale?: number) {
        this.x = x;
        this.y = y;
        this.x_vel = 0;
        this.y_vel = 0;
        this.mass = mass;
        this.scale = scale;
    }
}

class PhysicsMath {
    distance(a: PlanetaryBody, b: PlanetaryBody): number {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }

    // f = (g * m1 * m2) / d^2
    gravitationalForce(a: PlanetaryBody, b: PlanetaryBody): number {
        return (Constants.gravity * a.mass * b.mass) / this.distance(a, b) ** 2;
    }
}


// example objects
/*
const objects = [
    new Planet(500, 300, 3, 50),
    new Planet(400, 600, 4, 60),
    new Planet(400, 100, 2, 20),
    new Planet(200, 300, 5, 70),
];
*/

// example simulation of the solar system
const sun = new Planet(0, 0, 1.989e30, 30);

const earth = new Planet(1.5e11, 0, 5.972e24, 10);
earth.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(earth, sun));

const mars = new Planet(2.28e11, 0, 6.39e23, 8);
mars.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(mars, sun));

const mercury = new Planet(5.79e10, 0, 3.30e23, 6);
mercury.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(mercury, sun));

const venus = new Planet(1.08e11, 0, 4.87e24, 9);
venus.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(venus, sun));

const jupiter = new Planet(7.78e11, 0, 1.898e27, 15);
jupiter.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(jupiter, sun));

const saturn = new Planet(1.43e12, 0, 5.68e26, 13);
saturn.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(saturn, sun));

const uranus = new Planet(2.87e12, 0, 8.68e25, 12);
uranus.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(uranus, sun));

const neptune = new Planet(4.50e12, 0, 1.02e26, 11);
neptune.y_vel = Math.sqrt(Constants.gravity * sun.mass / PhysicsMath.prototype.distance(neptune, sun));

const objects = [sun, earth, mars, mercury, venus, jupiter, saturn, uranus, neptune];

// asteroid belt
for (let i = 0; i < 100; i++) {
    const radius = 2.8e11 + Math.random() * 1e11;
    const angle = Math.random() * 2 * Math.PI;
    const asteroid = new Planet(radius * Math.cos(angle), radius * Math.sin(angle), 1e20, 1);

    // eccentricity
    const eccentricity = Math.random() * 0.2; 
    const velocity = Math.sqrt(Constants.gravity * sun.mass / radius);

    asteroid.x_vel = -Math.sin(angle) * velocity;
    asteroid.y_vel = Math.cos(angle) * velocity * (1 + eccentricity);

    objects.push(asteroid);
}

// kuiper belt
for (let i = 0; i < 100; i++) {
    const radius = 4.5e12 + Math.random() * 1e12;
    const angle = Math.random() * 2 * Math.PI;
    const kuiper = new Planet(radius * Math.cos(angle), radius * Math.sin(angle), 1e22, 2);

    // eccentricity
    const eccentricity = Math.random() * 0.3;
    const velocity = Math.sqrt(Constants.gravity * sun.mass / radius);

    kuiper.x_vel = -Math.sin(angle) * velocity;
    kuiper.y_vel = Math.cos(angle) * velocity * (1 + eccentricity);

    objects.push(kuiper);
}

const physics = new PhysicsMath();
function update_logic() {
    for (const object of objects) {
        let total_x_force = 0;
        let total_y_force = 0;

        for (const other of objects) {
            if (object === other) continue;

            const force = physics.gravitationalForce(object, other);
            const angle = Math.atan2(other.y - object.y, other.x - object.x);
            total_x_force += Math.cos(angle) * force;
            total_y_force += Math.sin(angle) * force;
        }

        const x_acc = total_x_force / object.mass;
        const y_acc = total_y_force / object.mass;

        object.x_vel += x_acc * Constants.time_update;
        object.y_vel += y_acc * Constants.time_update;

        object.x += object.x_vel * Constants.time_update;
        object.y += object.y_vel * Constants.time_update;
    }
}

function draw_loop(delta) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const object of objects) {
        const t_x = object.x * Constants.scaler * zoom + (canvas.width / 2);
        const t_y = object.y * Constants.scaler * zoom + (canvas.height / 2);


        ctx.beginPath();
        ctx.arc(t_x, t_y, object.scale ?? 20 * zoom, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        if (zoom > 0.5) {
            ctx.fillStyle = "#000";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`[${object.x_vel.toFixed(2)}, ${object.y_vel.toFixed(2)}]`, t_x, t_y - (object.scale ?? 20) / 2 - (object.scale ?? 20) * 0.65);
        }
    }
}

let last_time = performance.now();
function loop() {
    const now = performance.now();
    const delta = now - last_time;
    last_time = now;

    update_logic();
    draw_loop(delta);

    requestAnimationFrame(loop);
}

loop();

// handle resizing, set initial canvas stuff
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

window.addEventListener("resize", () => {
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
});

// zoom
let zoom = 1;
const target_zoom = zoom;
let zoom_vel = 0;
const zoom_speed = 0.0025;
const zoom_damp = 0.85;

window.addEventListener("wheel", (e) => {
    zoom_vel += -e.deltaY * zoom_speed;
});

function update_zoom() {
    zoom_vel *= zoom_damp;
    zoom *= 1 + zoom_vel;

    requestAnimationFrame(update_zoom);
}

update_zoom();