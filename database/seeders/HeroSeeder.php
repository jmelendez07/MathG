<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Hero;
use App\Models\HeroAnimations;
use App\Models\HeroRole;
use App\Models\TypeCard;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeroSeeder extends Seeder
{
    private $heroNames = [
        'Warrior', 'Ninja', 'Ragnar', 'Artemis', 'Thor', 'Athena', 'Leonidas', 'Mulan',
        'Achilles', 'Xena', 'Spartacus', 'Valkyrie', 'Samurai', 'Gladiator', 'Ranger',
        'Assassin', 'Paladin', 'Crusader', 'Berserker', 'Champion', 'Warlord', 'Sentinel',
        'Vanguard', 'Reaper', 'Shadow', 'Phoenix', 'Dragon', 'Tiger', 'Panther', 'Falcon',
        'Cobra', 'Scorpion', 'Viper', 'Raptor', 'Tempest', 'Blade', 'Storm', 'Titan',
        'Goliath', 'Hercules'
    ];

    private $heroAssets = [
        ['hero' => 'hero-1', 'avatar' => 'avatar-hero-1', 'card' => 'hero-1', 'attack_frames' => 8],
        ['hero' => 'hero-4', 'avatar' => 'avatar-hero-4', 'card' => 'hero-4', 'attack_frames' => 6],
    ];

    public function run(): void
    {
        Hero::truncate();
        Card::truncate();
        
        for ($i = 0; $i < 40; $i++) {
            $this->createHero($i);
        }
    }

    private function createHero(int $index): void
    {
        $heroRoles = HeroRole::all();
        $heroRole = $heroRoles->random();
        
        $assetIndex = $index % 2; // Alterna entre hero-1 y hero-4
        $asset = $this->heroAssets[$assetIndex];
        
        $hero = Hero::create([
            'name' => $this->heroNames[$index],
            'spritesheet' => asset("assets/default_heroes/{$asset['hero']}.png"),
            'health' => rand(80, 250),
            'avatar_url' => asset("assets/default_heroes/{$asset['avatar']}.png"),
            'hero_role_id' => $heroRole->id,
        ]);

        $types = TypeCard::where('name', 'Ataque')->first();
        
        for ($i = 0; $i < 8; $i++) {
            Card::factory()->create([
                'hero_id' => $hero->id,
                'spritesheet' => asset("assets/cards/{$asset['card']}/card-{$asset['card']}.png"),
                'energy_cost' => rand(1, 2),
                'stats' => rand(10, 20),
                'type_card_id' => $types->id,
            ]);
        }

        HeroAnimations::factory()->create([
            'hero_id' => $hero->id,
            'action' => 'attack',
            'spritesheet_url' => asset("assets/default_heroes/{$asset['hero']}.png"),
            'row' => 64,
            'totalAnimationsFrames' => $asset['attack_frames'],
            'totalTilesFrames' => 21,
        ]);

        HeroAnimations::factory()->create([
            'hero_id' => $hero->id,
            'action' => 'fighting',
            'spritesheet_url' => asset("assets/default_heroes/{$asset['hero']}.png"),
            'row' => 45,
            'totalAnimationsFrames' => 2,
            'totalTilesFrames' => 2,
        ]);

        HeroAnimations::factory()->create([
            'hero_id' => $hero->id,
            'action' => 'walk',
            'spritesheet_url' => asset("assets/default_heroes/{$asset['hero']}.png"),
            'row' => 0,
            'totalAnimationsFrames' => 9,
            'totalTilesFrames' => 9,
        ]);
    }
}
