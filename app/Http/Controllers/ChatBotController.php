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

        $result = Gemini::generativeModel(model: config('gemini.api_model'))->generateContent($request->input('message'));

        return response()->json([
            'data' => $result->text(),
        ]);
    }
}