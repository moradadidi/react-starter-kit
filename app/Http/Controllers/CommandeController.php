<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Client;
use App\Models\CommandeItem;
use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::with(['client', 'items', 'type'])->get();
        // dd($commandes);
        return Inertia::render('commandes/index', compact('commandes'));
    }


public function create()
{
    $clients = Client::all();
    $types = Type::all();

    return Inertia::render('commandes/create', [
        'clients' => $clients,
        'types' => $types,
    ]);
}


    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'type_id' => 'required|exists:types,id',
            'date' => 'required|date',
            'status' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.designation' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($data['items'])->sum(function ($item) {
            return $item['quantity'] * $item['unit_price'];
        });

        $total_due = $subtotal + ($data['previous_balance'] ?? 0);

        $commande = Commande::create([
            'client_id' => $data['client_id'],
            'type_id' => $data['type_id'], // ✅ Add this line
            'date' => $data['date'],
            'subtotal' => $subtotal,
            'previous_balance' => $data['previous_balance'] ?? 0,
            'total_due' => $total_due,
            'status' => $data['status'], // ✅ Include status if needed
        ]);
        

        foreach ($data['items'] as $item) {
            $commande->items()->create([
                'part_name' => $item['designation'], // use 'designation' here
                'quantity' => $item['quantity'],
                'rate' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
            
        }

        return redirect()->route('commandes.index')->with('success', 'Commande enregistrée avec succès!');
    }

    public function edit($id)
    {
        $commande = Commande::with('items')->findOrFail($id);
        $clients = Client::all();
        $types = Type::all();
        return Inertia::render('commandes/edit', compact('commande', 'clients', 'types'));
    }

    public function update(Request $request, $id)
    {
        $commande = Commande::findOrFail($id);
    
        $data = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'date' => 'required|date',
            'previous_balance' => 'nullable|numeric',
            'items' => 'required|array|min:1',
            'items.*.designation' => 'required|string', // changed part_name to designation
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.unit_price' => 'required|numeric|min:0', // changed rate to unit_price
        ]);
    
        $subtotal = collect($data['items'])->sum(function ($item) {
            return $item['quantity'] * $item['unit_price']; // updated to match input name
        });
    
        $total_due = $subtotal + ($data['previous_balance'] ?? 0);
    
        $commande->update([
            'client_id' => $data['client_id'],
            'date' => $data['date'],
            'subtotal' => $subtotal,
            'previous_balance' => $data['previous_balance'] ?? 0,
            'total_due' => $total_due,
        ]);
    
        // Delete the existing items before adding the updated ones
        $commande->items()->delete();
    
        foreach ($data['items'] as $item) {
            $commande->items()->create([
                'part_name' => $item['designation'], // used designation instead of part_name
                'quantity' => $item['quantity'],
                'rate' => $item['unit_price'], // used unit_price instead of rate
                'total' => $item['quantity'] * $item['unit_price'], // correctly calculate total
            ]);
        }
    
        return redirect()->route('commandes.index')->with('success', 'Commande mise à jour avec succès!');
    }
    

    public function destroy($id)
    {
        // Find the Commande by ID
        $commande = Commande::findOrFail($id);
    
        // Delete the related items first
        $commande->items()->delete();
    
        // Now delete the Commande
        $commande->delete();
    
        // Redirect with a success message
        return redirect()->route('commandes.index')->with('success', 'Commande supprimée avec succès!');
    }
    
}
