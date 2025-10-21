<?php

namespace Database\Seeders;

use App\Models\Planet;
use App\Models\Stage;
use App\Models\StageVectorPoint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StageSeeder extends Seeder
{
    public function run(): void
    {
        Stage::truncate();
        StageVectorPoint::truncate();
        
        $planets = Planet::orderBy('number')->get();
        $stages = [
            [
                'name' => 'Ciudad', 
                'image_url' => 'https://res.cloudinary.com/dvibz13t8/image/upload/v1760192834/mapa_tierra_1_mzfqj2.png',
                'image_public_id' => 'bg-gamepa-test_bzm76a',
                'points' => [
                    ['x' => 2493.5192629815747, 'y' => 164.804469273743],
                    ['x' => 4995.41541038526, 'y' => 1416.2011173184358],
                    ['x' => 2499.103852596315, 'y' => 2673.1843575418993],
                    ['x' => 5.584589614740368, 'y' => 1421.7877094972068],
                ],
            ],
            [
                'name' => 'Ciudad Gotica', 
                'image_url' => 'https://res.cloudinary.com/dvibz13t8/image/upload/v1760192834/mapa_tierra_1_mzfqj2.png',
                'image_public_id' => 'stage-2-map_vbxyvi',
                'points' => [
                    ['x' => 2493.5192629815747, 'y' => 164.804469273743],
                    ['x' => 4995.41541038526, 'y' => 1416.2011173184358],
                    ['x' => 2499.103852596315, 'y' => 2673.1843575418993],
                    ['x' => 5.584589614740368, 'y' => 1421.7877094972068],
                ],
            ],
        ];

        foreach ($planets as $planet) {
            foreach ($stages as $stageData) {
                $stage = $planet->stages()->create([
                    ...$stageData,
                    'number' => Stage::max('number') + 1,
                ]);

                foreach ($stageData['points'] as $point) {
                    $stage->points()->create($point);
                }
            } 
        } 
    }
}
