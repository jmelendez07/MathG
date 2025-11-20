<?php

namespace Database\Seeders;

use App\Models\EnemyType;
use App\Models\Enemy;
use App\Models\Planet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnemySeeder extends Seeder
{
    public function run(): void
    {
        Enemy::truncate();
        
        $types = EnemyType::all();
        $planets = Planet::all();

        $enemies = [
            // [
            //     'name' => 'Goblin',
            //     'health' => 10,
            //     'basic_attack' => 10,
            //     'spritesheet' => asset('assets/default_enemies/enemy-1.png'),
            // ],
            [
                'name' => 'Orc',
                'health' => 45,
                'basic_attack' => 10,
                'spritesheet' => asset('assets/default_enemies/enemy-2.png'),
            ],
            [
                'name' => 'Troll',
                'health' => 30,
                'basic_attack' => 20,
                'spritesheet' => asset('assets/default_enemies/enemy-3.png'),
            ],
            [
                'name' => 'Dragon',
                'health' => 60,
                'basic_attack' => 15,
                'spritesheet' => asset('assets/default_enemies/enemy-4.png'),
            ],
        ];

        foreach ($enemies as $enemy) {
            foreach ($planets as $planet) {
                foreach ($types as $type) {
                    Enemy::create([
                        'name' => $enemy['name'],
                        'spritesheet' => $enemy['spritesheet'],
                        'health' => $enemy['health'],
                        'is_hostile' => true,
                        'basic_attack' => $enemy['basic_attack'],
                        'planet_id' => $planet->id,
                        'enemy_type_id' => $type->id,
                    ]);       
                }
            }
        }
    }
}
