<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\Stage;
use App\Models\Planet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mission::truncate();

        // Obtener stages basados en el planeta al que pertenecen
        $planetEarth = Planet::where('name', 'Tierra')->first();
        $planetMercury = Planet::where('name', 'Mercurio')->first();
        $planetVenus = Planet::where('name', 'Venus')->first();
        $planetMars = Planet::where('name', 'Marte')->first();

        if ($planetEarth) {
            $stagesEarth = Stage::where('planet_id', $planetEarth->id)->get();
            $this->createMissionsForEarth($stagesEarth);
        }

        if ($planetMercury) {
            $stagesMercury = Stage::where('planet_id', $planetMercury->id)->get();
            $this->createMissionsForMercury($stagesMercury);
        }

        if ($planetVenus) {
            $stagesVenus = Stage::where('planet_id', $planetVenus->id)->get();
            $this->createMissionsForVenus($stagesVenus);
        }

        if ($planetMars) {
            $stagesMars = Stage::where('planet_id', $planetMars->id)->get();
            $this->createMissionsForMars($stagesMars);
        }
    }

    private function createMissionsForEarth($stages): void
    {
        $stages->where('name', 'Ciudad')->each(function ($stage) {
            $numMissions = rand(2, 4); // 2 a 4 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Patrulla Urbana', 'description' => 'Derrota a los enemigos en la ciudad.'],
                ['name' => 'Recolección de Recursos', 'description' => 'Recolecta recursos en el área urbana.'],
                ['name' => 'Exploración Callejera', 'description' => 'Explora las calles de la ciudad.'],
                ['name' => 'Defensa del Distrito', 'description' => 'Protege el distrito de los invasores.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(2, 5),
                        'stage_id' => $stage->id,
                    ]);
                }
            }
        });

        $stages->where('name', 'Ciudad Gotica')->each(function ($stage) {
            $numMissions = rand(2, 3); // 2 a 3 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Infiltración Nocturna', 'description' => 'Infiltrate en la base enemiga.'],
                ['name' => 'Defensa de la Torre', 'description' => 'Protege la torre de vigilancia.'],
                ['name' => 'Asedio Final', 'description' => 'Prepárate para el asalto final.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(3, 6),
                        'stage_id' => $stage->id,
                    ]);
                }
            }

            // Jefe final siempre presente
            Mission::create([
                'name' => 'El Último Guardián',
                'description' => 'Derrota al Jefe Final del Planeta Tierra.',
                'number_actions' => 1,
                'stage_id' => $stage->id,
            ]);
        });
    }

    private function createMissionsForMercury($stages): void
    {
        $stages->where('name', 'Ciudad')->each(function ($stage) {
            $numMissions = rand(3, 5); // 3 a 5 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Batalla en el Desierto', 'description' => 'Derrota a los enemigos en la ciudad.'],
                ['name' => 'Supervivencia Extrema', 'description' => 'Sobrevive al calor extremo del planeta.'],
                ['name' => 'Travesía Ardiente', 'description' => 'Encuentra el camino a través del desierto.'],
                ['name' => 'Oasis Perdido', 'description' => 'Localiza el oasis en medio del desierto.'],
                ['name' => 'Tormenta Solar', 'description' => 'Resiste la tormenta solar.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(4, 7),
                        'stage_id' => $stage->id,
                    ]);
                }
            }
        });

        $stages->where('name', 'Ciudad Gotica')->each(function ($stage) {
            $numMissions = rand(2, 4); // 2 a 4 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Guardianes del Volcán', 'description' => 'Derrota a los guardianes del volcán.'],
                ['name' => 'Fortaleza de Lava', 'description' => 'Conquista la fortaleza de lava.'],
                ['name' => 'Cámara de Magma', 'description' => 'Atraviesa la cámara de magma.'],
                ['name' => 'Puerta de Fuego', 'description' => 'Abre la puerta de fuego.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(5, 8),
                        'stage_id' => $stage->id,
                    ]);
                }
            }

            // Jefe final siempre presente
            Mission::create([
                'name' => 'El Señor del Fuego',
                'description' => 'Derrota al Jefe Final del Planeta Mercurio.',
                'number_actions' => 1,
                'stage_id' => $stage->id,
            ]);
        });
    }

    private function createMissionsForVenus($stages): void
    {
        $stages->where('name', 'Ciudad')->each(function ($stage) {
            $numMissions = rand(3, 4); // 3 a 4 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Combate en la Niebla', 'description' => 'Derrota a los enemigos en la ciudad.'],
                ['name' => 'Tormenta Ácida', 'description' => 'Atraviesa la tormenta ácida.'],
                ['name' => 'Operación Rescate', 'description' => 'Rescata a los supervivientes.'],
                ['name' => 'Nubes Venenosas', 'description' => 'Navega entre las nubes venenosas.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(6, 9),
                        'stage_id' => $stage->id,
                    ]);
                }
            }
        });

        $stages->where('name', 'Ciudad Gotica')->each(function ($stage) {
            $numMissions = rand(3, 5); // 3 a 5 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Destrucción de Torres', 'description' => 'Destruye las torres de defensa.'],
                ['name' => 'Cielo Tóxico', 'description' => 'Navega a través de los cielos venenosos.'],
                ['name' => 'Santuario Contaminado', 'description' => 'Purifica el santuario contaminado.'],
                ['name' => 'Plataformas Flotantes', 'description' => 'Conquista las plataformas flotantes.'],
                ['name' => 'Cúpula de Cristal', 'description' => 'Penetra la cúpula de cristal.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(6, 10),
                        'stage_id' => $stage->id,
                    ]);
                }
            }

            // Jefe final siempre presente
            Mission::create([
                'name' => 'La Reina del Veneno',
                'description' => 'Derrota al Jefe Final del Planeta Venus.',
                'number_actions' => 1,
                'stage_id' => $stage->id,
            ]);
        });
    }

    private function createMissionsForMars($stages): void
    {
        $stages->where('name', 'Ciudad')->each(function ($stage) {
            $numMissions = rand(4, 6); // 4 a 6 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Asalto Marciano', 'description' => 'Derrota a los enemigos en la ciudad.'],
                ['name' => 'Conquista Colonial', 'description' => 'Conquista las colonias marcianas.'],
                ['name' => 'Ruinas Ancestrales', 'description' => 'Investiga las ruinas antiguas.'],
                ['name' => 'Canales de Marte', 'description' => 'Explora los antiguos canales.'],
                ['name' => 'Montes Olimpo', 'description' => 'Escala el monte más alto del sistema solar.'],
                ['name' => 'Valle Mariner', 'description' => 'Atraviesa el gran valle.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(8, 12),
                        'stage_id' => $stage->id,
                    ]);
                }
            }
        });

        $stages->where('name', 'Ciudad Gotica')->each(function ($stage) {
            $numMissions = rand(3, 4); // 3 a 4 misiones aleatorias
            
            $missionNames = [
                ['name' => 'Élite Carmesí', 'description' => 'Elimina las fuerzas de élite.'],
                ['name' => 'Batalla Final', 'description' => 'Prepárate para el enfrentamiento final.'],
                ['name' => 'Fortaleza Roja', 'description' => 'Asalta la fortaleza roja.'],
                ['name' => 'Última Resistencia', 'description' => 'Vence la última resistencia enemiga.'],
            ];

            for ($i = 0; $i < $numMissions; $i++) {
                if (isset($missionNames[$i])) {
                    Mission::create([
                        'name' => $missionNames[$i]['name'],
                        'description' => $missionNames[$i]['description'],
                        'number_actions' => rand(8, 11),
                        'stage_id' => $stage->id,
                    ]);
                }
            }

            // Jefe final siempre presente
            Mission::create([
                'name' => 'El Conquistador Rojo',
                'description' => 'Derrota al Jefe Final del Planeta Marte.',
                'number_actions' => 1,
                'stage_id' => $stage->id,
            ]);
        });
    }
}
