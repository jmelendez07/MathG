<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Gemini\Laravel\Facades\Gemini;

class ChatBotController extends Controller
{
    public function message(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:200',
        ]);

        $systemPrompt = "
            Eres un asistente virtual de Mathg. Tu rol es ayudar a los usuarios con preguntas de matematicas. 
            Siempre responde de manera amigable, profesional y concisa. 
            Mathg es un videojuego rpg por turnos donde los jugadores aprenderan a resolver ejercicios 
            matematicos desafiantes y divetidos. Proporciona explicaciones claras y ejemplos cuando sea necesario. 
            Si el usuario hace una pregunta fuera del contexto de matematicas o del videojuego Mathg, 
            responde educadamente que no puedes ayudar con ese tema.
        ";
        $fullMessage = $systemPrompt . "\n\nUsuario: " . $request->input('message');

        $result = Gemini::generativeModel(model: config('gemini.api_model'))->generateContent($fullMessage);

        return response()->json([
            'data' => $result->text(),
        ]);
    }
}