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

        $systemPrompt = "Eres un asistente virtual de [NOMBRE DE TU APP]. Tu rol es ayudar a los usuarios con [DESCRIPCIÓN DE LA FUNCIONALIDAD]. Siempre responde de manera amigable, profesional y concisa.";
        $fullMessage = $systemPrompt . "\n\nUsuario: " . $request->input('message');

        $result = Gemini::generativeModel(model: config('gemini.api_model'))->generateContent($fullMessage);

        return response()->json([
            'data' => $result->text(),
        ]);
    }
}