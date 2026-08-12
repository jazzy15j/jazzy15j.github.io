"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import { ARCHETYPE_LABEL, type DayArchetype, type Difficulty } from "../lib/types";
import { Sheet } from "./ui/Sheet";
import PhotoPicker from "./PhotoPicker";

const ARCHETYPES: DayArchetype[] = [
  "bowl",
  "taco",
  "comfort",
  "pasta",
  "fun",
  "wildcard",
  "leftover",
  "breakfast",
];

export default function AddRecipeSheet({
  onClose,
  initialPhotoId,
  initialName,
  onCreated,
}: {
  onClose: () => void;
  initialPhotoId?: string;
  initialName?: string;
  onCreated?: (recipeId: string) => void;
}) {
  const { addCustomRecipe } = useStore();
  const [name, setName] = useState(initialName ?? "");
  const [mainProtein, setMainProtein] = useState("");
  const [archetype, setArchetype] = useState<DayArchetype>("fun");
  const [servings, setServings] = useState(2);
  const [timeMinutes, setTimeMinutes] = useState(20);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [photoId, setPhotoId] = useState<string | undefined>(initialPhotoId);

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const ingredients = ingredientsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => ({
        name: line,
        amount: "",
        category: "other" as const,
        estCost: 0,
        confidence: "estimated" as const,
      }));
    const steps = stepsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const id = addCustomRecipe({
      name: name.trim(),
      archetype,
      mainProtein: mainProtein.trim() || "—",
      icon: "🍽️",
      ingredients,
      steps,
      servings,
      timeMinutes,
      difficulty,
      costConfidence: "estimated",
      leftoverQuality: "ok",
      freezerFriendly: false,
      pantryStaplesUsed: [],
      notes: [],
      photoId,
    });
    onCreated?.(id);
    onClose();
  };

  return (
    <Sheet title="Log your own recipe" onClose={onClose} wide>
      <p className="egsl-muted egsl-mt-0" style={{ fontSize: 13 }}>
        Snap a photo, jot down what went in, and it joins the rotation just like the built-in
        meals.
      </p>

      <div className="egsl-field">
        <label>Photo (optional)</label>
        <PhotoPicker photoId={photoId} onChange={setPhotoId} />
      </div>

      <div className="egsl-field">
        <label>Name</label>
        <input
          className="egsl-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kielbasa, rice & jalapeño skillet"
        />
      </div>

      <div className="egsl-field">
        <label>Main protein (optional)</label>
        <input
          className="egsl-input"
          value={mainProtein}
          onChange={(e) => setMainProtein(e.target.value)}
          placeholder="Kielbasa"
        />
      </div>

      <div className="egsl-field">
        <label>Category</label>
        <div className="egsl-segmented">
          {ARCHETYPES.map((a) => (
            <button key={a} className={archetype === a ? "active" : ""} onClick={() => setArchetype(a)}>
              {ARCHETYPE_LABEL[a]}
            </button>
          ))}
        </div>
      </div>

      <div className="egsl-row egsl-gap-12" style={{ marginBottom: 14 }}>
        <div className="egsl-field" style={{ flex: 1, marginBottom: 0 }}>
          <label>Servings</label>
          <input
            className="egsl-input"
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="egsl-field" style={{ flex: 1, marginBottom: 0 }}>
          <label>Time (min)</label>
          <input
            className="egsl-input"
            type="number"
            min={1}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      </div>

      <div className="egsl-field">
        <label>Difficulty</label>
        <div className="egsl-segmented">
          {(["easy", "medium"] as const).map((d) => (
            <button key={d} className={difficulty === d ? "active" : ""} onClick={() => setDifficulty(d)}>
              {d === "easy" ? "Easy" : "Medium"}
            </button>
          ))}
        </div>
      </div>

      <div className="egsl-field">
        <label>Ingredients (one per line, optional)</label>
        <textarea
          className="egsl-textarea"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          placeholder={"12 oz kielbasa\n1 cup rice\n1 onion\n1 jalapeño"}
        />
      </div>

      <div className="egsl-field">
        <label>Steps (one per line, optional)</label>
        <textarea
          className="egsl-textarea"
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          placeholder={"Start rice.\nSlice and brown kielbasa.\nAdd onion and jalapeño, cook through."}
        />
      </div>

      <button className="egsl-btn egsl-btn-primary egsl-btn-block" disabled={!canSave} onClick={save}>
        Save recipe
      </button>
    </Sheet>
  );
}
