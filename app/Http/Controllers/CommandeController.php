<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Client;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
class CommandeController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index()
    {
        $commandes = Commande::with(['client', 'type'])->get(); // Include related clients and types for display
        return Inertia::render('commandes/index', compact('commandes'));
    }

    /**
     * Show the form for creating a new order.
     */
    public function create()
    {
        $clients = Client::all(); 
        $types = Type::all(); 
        return Inertia::render('commandes/create', compact( 'clients', 'types'));
    }

    /**
     * Store a newly created order in the database.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'type_id' => 'required|exists:types,id',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->route('commandes.create')
                ->withErrors($validator)
                ->withInput();
        }

        $totalAmount = $request->quantity * $request->unit_price;

        Commande::create([
            'client_id' => $request->client_id,
            'type_id' => $request->type_id,
            'date' => $request->date,
            'quantity' => $request->quantity,
            'unit_price' => $request->unit_price,
            'total_amount' => $totalAmount,
            'paid_amount' => 0, 
            'rest' => $totalAmount, 
            'status' => $request->status,
        ]);
        

        
        return Redirect::route('commandes.index')->with('success', 'Order created successfully!');
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit($id)
    {
        $commande = Commande::findOrFail($id); 
        $clients = Client::all(); 
        $types = Type::all(); 
        return Inertia::render('commandes/edit', compact(  'commande', 'clients', 'types'));
    }

    /**
     * Update the specified order in the database.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'type_id' => 'required|exists:types,id',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->route('commandes.edit', ['commande' => $id])
                ->withErrors($validator)
                ->withInput();
        }

        $totalAmount = $request->quantity * $request->unit_price;

        $commande = Commande::findOrFail($id);
        $commande->update([
            'client_id' => $request->client_id,
            'type_id' => $request->type_id,
            'date' => $request->date,
            'quantity' => $request->quantity,
            'unit_price' => $request->unit_price,
            'total_amount' => $totalAmount,
            'paid_amount' => $commande->paid_amount, 
            'rest' => $totalAmount - $commande->paid_amount, 
            'status' => $request->status,
        ]);

        return Redirect::route('commandes.index')->with('success', 'Order updated successfully!');
    }

    /**
     * Remove the specified order from the database.
     */
    public function destroy($id)
    {
        $commande = Commande::findOrFail($id);
        $commande->delete();

        return Redirect::route('commandes.index')->with('success', 'Order deleted successfully!');
    }
}
