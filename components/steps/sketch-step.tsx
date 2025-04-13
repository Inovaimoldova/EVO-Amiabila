"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react" // Added useCallback
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Type, Trash2, Save, Car, Undo, Redo, ArrowRight } from "lucide-react"

// --- Constants ---
const MIN_CAR_SCALE = 0.3;
const MAX_CAR_SCALE = 3.0;
const SELECTION_PADDING = 5; // Visual padding for selection box
const HANDLE_SIZE = 8; // Visual size of the rotation/scale handle
const ROTATION_HANDLE_VISUAL_OFFSET = 15; // How far the handle appears from the car's edge
const LIGHT_RADIUS = 1.5; // Radius for headlights/taillights
const LIGHT_OFFSET = 3; // How far lights are inset from corners
const ARROW_COLOR = "#FFD700"; // Yellow for arrows
const ARROW_HEAD_LENGTH = 10; // Length of the arrowhead lines
const ARROW_HEAD_ANGLE = Math.PI / 6; // Angle of the arrowhead lines (30 degrees)

// --- Types ---
interface SketchStepProps {
  data: string | null
  updateData: (data: string) => void
  onContinue: () => void
  onBack: () => void
}

interface DrawnElement {
  id: string
  type: "line" | "text" | "car" | "arrow"
  // Line specific
  points?: { x: number; y: number }[]
  // Text specific
  text?: string
  // Car/Text common
  position?: { x: number; y: number }
  // Car specific
  carType?: "A" | "B"
  rotation?: number // Radians
  scale?: number // Scale factor
  // Arrow specific
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
  // Common
  color?: string
}

// State for active interaction
interface InteractionInfo {
    state: "dragging" | "rotating_scaling" | "drawing_arrow" | "none";
    elementId?: string | null; // ID of element being interacted with
    // For dragging
    dragOffsetX?: number;
    dragOffsetY?: number;
    // For rotating/scaling
    initialDistance?: number; // Distance from center to pointer on interaction start
    initialScale?: number; // Element scale on interaction start
    initialRotation?: number; // Element rotation on interaction start
    // For drawing arrows (replace freehand drawing)
    arrowStartPoint?: { x: number; y: number };
    currentArrowEndPoint?: { x: number; y: number }; // Temporary end point while drawing
}


const generateId = () => `_${Math.random().toString(36).substring(2, 9)}`

export default function SketchStep({ data, updateData, onContinue, onBack }: SketchStepProps) {
  // --- State ---
  const [sketchImage, setSketchImage] = useState<string | null>(data)
  const [showEditor, setShowEditor] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>("pencil") // Default tool (pencil now means select/move/rotate)
  const [drawnElements, setDrawnElements] = useState<DrawnElement[]>([
    // Initial example elements
    {
      id: generateId(),
      type: "car",
      position: { x: 100, y: 100 },
      carType: "A",
      rotation: 0,
      scale: 1, // Initial scale
    },
    {
      id: generateId(),
      type: "car",
      position: { x: 250, y: 180 },
      carType: "B",
      rotation: Math.PI / 4,
      scale: 1.2, // Example initial scale
    },
  ])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  // Consolidated interaction state
  const [interaction, setInteraction] = useState<InteractionInfo>({ state: "none" })
  // State for the background image
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false); // Track background load status


  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)


  // --- Background Image Loading ---
  useEffect(() => {
      if (showEditor && !isBgLoaded) {
          const img = new Image();
          img.onload = () => {
              setBackgroundImage(img);
              setIsBgLoaded(true); // Trigger redraw once loaded
              console.log("Background image loaded.");
          };
          img.onerror = () => {
              console.error("Failed to load background image.");
              setBackgroundImage(null); // Ensure it's null on error
              setIsBgLoaded(true); // Mark as 'loaded' (or failed) to prevent reload attempts
          };
          img.src = "/map.png"; // Path relative to the public folder
      }
      // Reset load status if editor is hidden
      if (!showEditor) {
          setIsBgLoaded(false);
          setBackgroundImage(null);
      }
  }, [showEditor, isBgLoaded]); // Depend on editor visibility and load status


  // --- Coordinate and Hit Detection Helpers ---

  /** Calculates pointer coordinates relative to the canvas. */
  const getEventPos = (evt: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number;
    if ('touches' in evt) {
      if (evt.touches.length === 0) return { x: 0, y: 0 }; // Handle touch end case
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }
    // Adjust for internal canvas scaling (currently 2x)
    const scaleX = canvas.width / (canvas.offsetWidth * 2);
    const scaleY = canvas.height / (canvas.offsetHeight * 2);
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  }

  /** Calculates distance between two points. */
   const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  /** Checks if a point is inside a rotated & scaled rectangle (car body). */
  const isPointInCarBody = ( point: { x: number; y: number }, element: DrawnElement ): boolean => {
    if (element.type !== "car" || !element.position) return false;
    const scale = element.scale ?? 1; // Use scale, default to 1
    const carWidth = 30; // Base width
    const carHeight = 15; // Base height
    const angle = element.rotation || 0;
    const cx = element.position.x;
    const cy = element.position.y;

    // Translate point to car's origin and rotate backwards
    const dx = point.x - cx;
    const dy = point.y - cy;
    const cosA = Math.cos(-angle);
    const sinA = Math.sin(-angle);
    const rotatedX = dx * cosA - dy * sinA;
    const rotatedY = dx * sinA + dy * cosA;

    // Check against scaled dimensions
    return (
      rotatedX >= (-carWidth * scale) / 2 &&
      rotatedX <= (carWidth * scale) / 2 &&
      rotatedY >= (-carHeight * scale) / 2 &&
      rotatedY <= (carHeight * scale) / 2
    );
  }

   /** Calculates the position of the rotation/scale handle for a car. */
   const getRotationHandlePosition = (element: DrawnElement): { x: number; y: number } | null => {
        if (element.type !== 'car' || !element.position) return null;
        const scale = element.scale ?? 1;
        const carHeight = 15; // Base height
        const angle = element.rotation || 0;
        const cx = element.position.x;
        const cy = element.position.y;

        // Calculate offset based on scaled height + visual offset
        const totalOffsetY = (carHeight * scale) / 2 + ROTATION_HANDLE_VISUAL_OFFSET;

        // Calculate handle position relative to center, then rotate
        const handleLocalX = 0;
        const handleLocalY = -totalOffsetY; // Position above the scaled car (negative Y is front)

        // Rotate the local offset by the car's angle
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotatedOffsetX = handleLocalX * cosA - handleLocalY * sinA;
        const rotatedOffsetY = handleLocalX * sinA + handleLocalY * cosA;

        // Add the rotated offset to the center position
        const handleWorldX = cx + rotatedOffsetX;
        const handleWorldY = cy + rotatedOffsetY;


        return { x: handleWorldX, y: handleWorldY };
    }


  /** Checks if a point is on the rotation/scale handle of a selected car. */
  const isPointOnRotationHandle = ( point: { x: number; y: number }, element: DrawnElement ): boolean => {
    if (element.type !== 'car' || !selectedElementId || element.id !== selectedElementId) return false;

    const handlePos = getRotationHandlePosition(element);
    if (!handlePos) return false;

    const dx = point.x - handlePos.x;
    const dy = point.y - handlePos.y;
    const distSq = dx * dx + dy * dy;
    const handleRadius = HANDLE_SIZE; // Use larger radius for easier clicking

    return distSq <= handleRadius * handleRadius;
  }


  // --- Drawing ---

  /** Main drawing function, called on state changes. Uses useCallback. */
  const drawAllElements = useCallback(() => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const logicalWidth = canvas.width / 2;
    const logicalHeight = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    // --- Draw Background with Aspect Ratio Cover ---
    if (backgroundImage && isBgLoaded) {
        const img = backgroundImage;
        const canvasRatio = logicalWidth / logicalHeight;
        const imageRatio = img.naturalWidth / img.naturalHeight;
        let sourceX = 0, sourceY = 0, sourceWidth = img.naturalWidth, sourceHeight = img.naturalHeight;
        let drawWidth = logicalWidth;
        let drawHeight = logicalHeight;

        if (imageRatio > canvasRatio) { // Image is wider than canvas; crop sides
            sourceWidth = img.naturalHeight * canvasRatio;
            sourceX = (img.naturalWidth - sourceWidth) / 2;
        } else { // Image is taller than canvas; crop top/bottom
            sourceHeight = img.naturalWidth / canvasRatio;
            sourceY = (img.naturalHeight - sourceHeight) / 2;
        }
        // Draw the calculated portion of the image onto the entire canvas
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, logicalWidth, logicalHeight);

    } else {
        // Fallback background color if image not loaded/failed
        ctx.fillStyle = "#f0f0f0"; // Light grey fallback
        ctx.fillRect(0, 0, logicalWidth, logicalHeight);
    }

    // --- Draw Elements ---
    drawnElements.forEach((element) => {
      ctx.save(); // Save context state for each element
      if (element.type === "line" && element.points && element.points.length > 1) {
        // Draw line element (keep for now if needed elsewhere)
        ctx.beginPath()
        ctx.strokeStyle = element.color || "#000000"
        ctx.lineWidth = 2;
        ctx.moveTo(element.points[0].x, element.points[0].y)
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y)
        }
        ctx.stroke()
      } else if (element.type === "car" && element.position) {
        // Draw car element
        drawCar(
          ctx, // Pass context
          element.position.x,
          element.position.y,
          element.carType || "A",
          element.rotation || 0,
          element.scale ?? 1, // Pass scale
          element.id === selectedElementId // Pass selection status
        )
      } else if (element.type === "text" && element.position && element.text) {
        // Draw text element
        ctx.font = "14px Arial"
        ctx.fillStyle = element.color || "#000000"
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(element.text, element.position.x, element.position.y)
      } else if (element.type === "arrow" && element.startPoint && element.endPoint) {
        // Draw arrow element
        drawArrow(ctx, element.startPoint, element.endPoint, element.color || ARROW_COLOR);
      }
      ctx.restore(); // Restore context state
    })

    // Draw current arrow being drawn
    if (interaction.state === 'drawing_arrow' && interaction.arrowStartPoint && interaction.currentArrowEndPoint) {
        drawArrow(ctx, interaction.arrowStartPoint, interaction.currentArrowEndPoint, ARROW_COLOR);
    }

  }, [drawnElements, selectedElementId, interaction, backgroundImage, isBgLoaded]); // Update dependencies


  /** Draws a single arrow with arrowhead. */
  const drawArrow = (
      ctx: CanvasRenderingContext2D,
      start: { x: number; y: number },
      end: { x: number; y: number },
      color: string = ARROW_COLOR
  ) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      // Draw line segment
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
          end.x - ARROW_HEAD_LENGTH * Math.cos(angle - ARROW_HEAD_ANGLE),
          end.y - ARROW_HEAD_LENGTH * Math.sin(angle - ARROW_HEAD_ANGLE)
      );
      ctx.moveTo(end.x, end.y); // Move back to the end point for the other line
      ctx.lineTo(
          end.x - ARROW_HEAD_LENGTH * Math.cos(angle + ARROW_HEAD_ANGLE),
          end.y - ARROW_HEAD_LENGTH * Math.sin(angle + ARROW_HEAD_ANGLE)
      );
      ctx.stroke(); // Stroke the arrowhead lines

      ctx.restore();
  }


  /** Draws a single car, including selection handles and lights. */
  const drawCar = (
    ctx: CanvasRenderingContext2D, // Pass context explicitly
    x: number,
    y: number,
    type: "A" | "B",
    rotation: number = 0,
    scale: number = 1, // Add scale parameter
    isSelected: boolean = false
  ) => {
    const carWidth = 30; // Base width
    const carHeight = 15; // Base height
    const wheelWidth = 5;
    const wheelHeight = 3;

    ctx.save(); // Save context state before transformations
    ctx.translate(x, y); // Move origin to car center
    ctx.rotate(rotation); // Apply rotation
    ctx.scale(scale, scale); // Apply scaling

    // --- Draw Car Body ---
    ctx.beginPath(); // Start a path for the car body
    const bodyColor = type === "A" ? "#0066CC" : "#ef4444";
    const strokeColor = type === "A" ? "#0052a3" : "#b91c1c";
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1 / scale; // Adjust line width based on scale
    ctx.fillRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);
    ctx.strokeRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);

    // --- Draw Wheels ---
    ctx.fillStyle = "#000";
    const wheelXOffset = carWidth * 0.3; // Example offset
    const wheelYOffset = carHeight / 2;
    ctx.fillRect(-wheelXOffset - wheelWidth / 2, -wheelYOffset - wheelHeight, wheelWidth, wheelHeight); // Front top
    ctx.fillRect(-wheelXOffset - wheelWidth / 2, wheelYOffset, wheelWidth, wheelHeight); // Front bottom
    ctx.fillRect(wheelXOffset - wheelWidth / 2, -wheelYOffset - wheelHeight, wheelWidth, wheelHeight); // Rear top
    ctx.fillRect(wheelXOffset - wheelWidth / 2, wheelYOffset, wheelWidth, wheelHeight); // Rear bottom

    // --- Draw Label ---
    ctx.fillStyle = "#fff";
    const fontSize = 10; // Constant font size looks better usually
    ctx.font = `bold ${fontSize / scale}px Arial`; // Adjust font size in context if needed
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(type, 0, 0); // Draw at scaled origin (0,0)

    ctx.restore(); // Restore context (removes scale, rotation, translation) - IMPORTANT: Do this BEFORE drawing lights/handles in world coords

    // --- Draw Lights (World Coordinates) ---
    const angle = rotation;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const scaledHalfW = (carWidth * scale) / 2;
    const scaledHalfH = (carHeight * scale) / 2;

    // Define local light positions relative to the car center (BEFORE rotation)
    // Front is -Y direction, Rear is +Y direction
    const localLights = [
        // Headlights (Front) - White
        { x: -scaledHalfW + LIGHT_OFFSET, y: -scaledHalfH + LIGHT_OFFSET, color: "#FFFFFF" }, // Front-Left
        { x:  scaledHalfW - LIGHT_OFFSET, y: -scaledHalfH + LIGHT_OFFSET, color: "#FFFFFF" }, // Front-Right
        // Taillights (Rear) - Red
        { x: -scaledHalfW + LIGHT_OFFSET, y:  scaledHalfH - LIGHT_OFFSET, color: "#FF0000" }, // Rear-Left
        { x:  scaledHalfW - LIGHT_OFFSET, y:  scaledHalfH - LIGHT_OFFSET, color: "#FF0000" }  // Rear-Right
    ];

    // Calculate world positions and draw lights
    localLights.forEach(light => {
        // Rotate the local light position
        const rotatedX = light.x * cosA - light.y * sinA;
        const rotatedY = light.x * sinA + light.y * cosA;
        // Translate to world position
        const worldX = x + rotatedX;
        const worldY = y + rotatedY;

        // Draw the light
        ctx.fillStyle = light.color;
        ctx.beginPath();
        ctx.arc(worldX, worldY, LIGHT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    });


    // --- Draw Selection Handles (if selected) - AFTER restoring context ---
    if (isSelected) {
      // Calculate handle position in world coordinates
      const handlePos = getRotationHandlePosition({ type: 'car', position: { x, y }, rotation, scale } as DrawnElement); // Cast needed for helper

      if (handlePos) {
        // Draw Bounding Box (World Coordinates)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 1; // Use non-scaled line width for handles
        ctx.setLineDash([3, 3]);
        // Draw scaled bounding box relative to center
        ctx.strokeRect(
          (-carWidth * scale) / 2 - SELECTION_PADDING,
          (-carHeight * scale) / 2 - SELECTION_PADDING,
          carWidth * scale + 2 * SELECTION_PADDING,
          carHeight * scale + 2 * SELECTION_PADDING
        );
        ctx.restore(); // Restore from rotation/translation

        // Draw Rotation/Scale Handle (World Coordinates)
        ctx.beginPath();
        ctx.arc(handlePos.x, handlePos.y, HANDLE_SIZE / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#007bff";
        ctx.fill();
        ctx.strokeStyle = "#ffffff"; // White border
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash pattern
      }
    }
  }


  // --- Canvas Setup Effect ---
  useEffect(() => {
    if (showEditor && canvasRef.current) {
      const canvas = canvasRef.current
      // Set canvas resolution
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      const context = canvas.getContext("2d")
      if (context) {
        context.scale(2, 2) // Scale context for drawing
        context.lineCap = "round"
        contextRef.current = context
        // Initial draw when context is ready and background status known
        if (isBgLoaded) {
             drawAllElements()
        }
      }
    }
  }, [showEditor, isBgLoaded, drawAllElements]) // Add isBgLoaded and drawAllElements

  // --- Redraw Effect ---
  useEffect(() => {
    // Redraw whenever elements, selection, interaction, or background load status changes
    if (showEditor && contextRef.current && isBgLoaded) {
      drawAllElements()
    }
  }, [drawnElements, selectedElementId, interaction, showEditor, drawAllElements, isBgLoaded]) // Keep isBgLoaded


  // --- Interaction Handlers ---

  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event && event.touches.length > 1) return; // Ignore multi-touch for now
    if ('button' in event && event.button !== 0) return; // Ignore right-clicks etc.

    const pos = getEventPos(event);
    let elementHit = false;
    let interactionStarted: InteractionInfo = { state: "none" };

    // 1. Check for handle interaction on selected element
    if (selectedElementId) {
        const selectedElement = drawnElements.find(el => el.id === selectedElementId);
        if (selectedElement && selectedElement.type === 'car' && isPointOnRotationHandle(pos, selectedElement)) {
            const initialDistance = distance(pos, selectedElement.position!);
            interactionStarted = {
                state: "rotating_scaling",
                elementId: selectedElementId,
                initialDistance: initialDistance,
                initialScale: selectedElement.scale ?? 1,
                initialRotation: selectedElement.rotation ?? 0,
            };
            elementHit = true;
        }
    }

    // 2. Check for body interaction if no handle was hit
    if (!elementHit) {
        for (let i = drawnElements.length - 1; i >= 0; i--) {
            const element = drawnElements[i];
            let hitBody = false;
            if (element.type === 'car' && isPointInCarBody(pos, element)) {
                hitBody = true;
            } // Add checks for other element types (lines, text) if needed

            if (hitBody && element.position) {
                setSelectedElementId(element.id); // Select the element
                interactionStarted = {
                    state: "dragging",
                    elementId: element.id,
                    dragOffsetX: pos.x - element.position.x,
                    dragOffsetY: pos.y - element.position.y,
                };
                elementHit = true;
                break; // Stop checking once an element is hit
            }
        }
    }

    // 3. If no element hit, handle tool actions or deselect
    if (!elementHit) {
        setSelectedElementId(null); // Deselect if background clicked

        if (selectedTool === "carA" || selectedTool === "carB") {
            const newCar: DrawnElement = {
                id: generateId(), type: "car", position: pos,
                carType: selectedTool === "carA" ? "A" : "B", rotation: 0, scale: 1,
            };
            setDrawnElements(prev => [...prev, newCar]);
            setSelectedElementId(newCar.id); // Select new car
            // Optionally switch back to select/pencil tool
            // setSelectedTool("pencil");
        } else if (selectedTool === "text") {
            const text = prompt("Introduceți textul:");
            if (text) {
                const newText: DrawnElement = {
                    id: generateId(), type: "text", position: pos, text, color: "#000000",
                };
                setDrawnElements(prev => [...prev, newText]);
                setSelectedElementId(newText.id);
            }
            // setSelectedTool("pencil");
        } else if (selectedTool === "pencil") {
            // Pencil tool now only selects or initiates dragging/rotating/scaling on existing elements
            // If no element was hit above, do nothing on click start for pencil.
            // Freehand drawing is removed.
        } else if (selectedTool === "arrow") {
            // Start drawing an arrow
            interactionStarted = {
                state: 'drawing_arrow',
                arrowStartPoint: pos,
                currentArrowEndPoint: pos // Start and end are the same initially
            };
            elementHit = true; // Mark interaction as started
        }
    }

    // Prevent default touch behavior like scrolling
    if ('touches' in event) event.preventDefault();

    setInteraction(interactionStarted); // Set the determined interaction state
  }


  const handleInteractionMove = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event && event.touches.length > 1) return; // Ignore multi-touch

    const pos = getEventPos(event);

    // Prevent default touch behavior like scrolling
    if ('touches' in event) event.preventDefault();

    // Handle dragging, rotating, scaling (existing logic)
    if (interaction.state === "dragging" || interaction.state === "rotating_scaling") {
        setDrawnElements(prevElements =>
            prevElements.map(el => {
                if (el.id !== interaction.elementId) return el; // Only modify interacting element

                let updatedElement = { ...el };

                if (interaction.state === "dragging" && interaction.dragOffsetX !== undefined && interaction.dragOffsetY !== undefined) {
                    updatedElement.position = {
                        x: pos.x - interaction.dragOffsetX,
                        y: pos.y - interaction.dragOffsetY,
                    };
                } else if (interaction.state === "rotating_scaling" && updatedElement.type === 'car' && updatedElement.position &&
                           interaction.initialDistance !== undefined && interaction.initialScale !== undefined && interaction.initialRotation !== undefined)
                {
                    // --- Rotation ---
                    const dx = pos.x - updatedElement.position.x;
                    const dy = pos.y - updatedElement.position.y;
                    // Calculate angle - adjust by PI/2 because handle is initially 'above' (negative Y)
                    const currentAngle = Math.atan2(dy, dx) + Math.PI / 2;
                    updatedElement.rotation = currentAngle; // Direct angle setting based on pointer position

                    // --- Scaling ---
                    const currentDistance = distance(pos, updatedElement.position);
                    let scaleFactor = 1;
                    // Avoid division by zero or tiny distances causing huge scaling
                    if (interaction.initialDistance > 1) {
                        scaleFactor = currentDistance / interaction.initialDistance;
                    }
                    let newScale = interaction.initialScale * scaleFactor;
                    // Clamp scale within limits
                    newScale = Math.max(MIN_CAR_SCALE, Math.min(MAX_CAR_SCALE, newScale));
                    updatedElement.scale = newScale;

                }

                return updatedElement;
            })
        );
    }

     // Update arrow drawing end point
    if (interaction.state === 'drawing_arrow') {
        setInteraction(prev => ({ ...prev, currentArrowEndPoint: pos }));
    }
  }


  const handleInteractionEnd = () => {
     // Finalize arrow drawing
     if (interaction.state === 'drawing_arrow' && interaction.arrowStartPoint && interaction.currentArrowEndPoint && distance(interaction.arrowStartPoint, interaction.currentArrowEndPoint) > 5) { // Avoid tiny arrows from clicks
        const newArrow: DrawnElement = {
            id: generateId(),
            type: 'arrow',
            startPoint: interaction.arrowStartPoint,
            endPoint: interaction.currentArrowEndPoint,
            color: ARROW_COLOR
        };
        setDrawnElements(prev => [...prev, newArrow]);
    }

    // Reset interaction state regardless of type
    if (interaction.state !== 'none') {
      setInteraction({ state: "none" });
    }
  }


  // --- Other Actions ---

  const clearCanvas = () => {
    setDrawnElements([])
    setSelectedElementId(null)
    setInteraction({ state: "none" }); // Reset interaction
  }

  const handleUndo = () => {
    // Basic undo - needs proper history for real implementation
    if (drawnElements.length > 0) {
      const lastElementId = drawnElements[drawnElements.length - 1].id;
      setDrawnElements((prev) => prev.slice(0, -1))
      // Deselect if the removed element was selected
      if (selectedElementId === lastElementId) {
          setSelectedElementId(null)
      }
    }
  }

  const handleRedo = () => { console.log("Redo action - not implemented") }

  const saveSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const currentSelection = selectedElementId;
    setSelectedElementId(null); // Temporarily deselect for clean image

    // Use requestAnimationFrame to ensure deselection redraw has occurred
    requestAnimationFrame(() => {
        if (!canvasRef.current || !contextRef.current) return;
        // Redraw one last time without selection
        drawAllElements();
        // Get data URL
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setSketchImage(dataUrl);
        setShowEditor(false);
        updateData(dataUrl);
        // Restore selection state if needed (though editor is closing)
        // setSelectedElementId(currentSelection);
    });
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
  }

  // --- Cursor Style ---
  const getCursorStyle = (): string => {
    // TODO: Add hover detection for more specific cursors (e.g., on handles)
    if (interaction.state === 'dragging') return 'grabbing';
    if (interaction.state === 'rotating_scaling') return 'grabbing'; // Or a specific rotate/scale cursor
    if (interaction.state === 'drawing_arrow') return 'crosshair'; // Cursor while drawing arrow

    switch (selectedTool) {
      case 'pencil': return selectedElementId ? 'move' : 'grab'; // Cursor for select/move
      case 'arrow': return 'crosshair'; // Cursor for starting arrow
      case 'text': return 'text';
      case 'carA':
      case 'carB': return 'copy'; // Indicates placement
      default: return 'default';
    }
  }

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Schița Accidentului</h2>

      {!showEditor ? (
        // Show saved image or button to start
        <div className="space-y-4">
          {sketchImage ? (
            <div className="space-y-3">
              <div className="border rounded-md overflow-hidden">
                <img src={sketchImage} alt="Schiță accident" className="w-full object-contain" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditor(true)}>
                  Editează Schița
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" className="w-full py-8 flex flex-col items-center gap-2 bg-[#0066CC] hover:bg-[#0052a3] text-white" onClick={() => setShowEditor(true)}>
              <Pencil className="h-6 w-6" /> <span>Desenează Schița</span>
            </Button>
          )}
        </div>
      ) : (
        // Show Editor
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Toolbar */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
              {/* Select/Move/Draw Tool (using Pencil Icon for now) */}
              <Button type="button" size="sm"
                variant={selectedTool === "pencil" ? "default" : "outline"}
                onClick={() => setSelectedTool("pencil")}
                className={selectedTool === "pencil" ? "bg-[#0066CC] hover:bg-[#0052a3] text-white" : "border-gray-300 text-gray-700"}
                title="Selectează / Mută / Rotește" >
                <Pencil className="h-4 w-4" />
              </Button>
              {/* Arrow Tool */}
              <Button type="button" size="sm"
                variant={selectedTool === "arrow" ? "default" : "outline"}
                onClick={() => setSelectedTool("arrow")}
                className={selectedTool === "arrow" ? "bg-[#FFD700] hover:bg-[#f0c400] text-black" : "border-gray-300 text-gray-700"}
                title="Desenează Săgeată" >
                <ArrowRight className="h-4 w-4" />
              </Button>
              {/* Text Tool */}
              <Button type="button" size="sm"
                variant={selectedTool === "text" ? "default" : "outline"}
                onClick={() => setSelectedTool("text")}
                className={selectedTool === "text" ? "bg-[#0066CC] hover:bg-[#0052a3] text-white" : "border-gray-300 text-gray-700"}
                title="Adaugă Text" >
                <Type className="h-4 w-4" />
              </Button>
              {/* Undo/Redo */}
              <Button type="button" size="sm" variant="outline" onClick={handleUndo} className="border-gray-300 text-gray-700" title="Anulează"><Undo className="h-4 w-4" /></Button>
              <Button type="button" size="sm" variant="outline" onClick={handleRedo} className="border-gray-300 text-gray-700" title="Refă (N/A)"><Redo className="h-4 w-4" /></Button>
              <div className="border-l mx-1 h-6 self-center"></div>
              {/* Car Tools */}
              <Button type="button" size="sm"
                variant={selectedTool === "carA" ? "default" : "outline"}
                onClick={() => setSelectedTool("carA")}
                className={`flex items-center gap-1 ${selectedTool === "carA" ? "bg-[#0066CC] hover:bg-[#0052a3] text-white" : "border-gray-300 text-gray-700"}`}
                title="Adaugă Vehicul A" >
                <Car className="h-4 w-4" /> <span>Vehicul A</span>
              </Button>
              <Button type="button" size="sm"
                variant={selectedTool === "carB" ? "default" : "outline"}
                onClick={() => setSelectedTool("carB")}
                className={`flex items-center gap-1 ${selectedTool === "carB" ? "bg-red-500 hover:bg-red-600 text-white" : "border-gray-300 text-gray-700"}`}
                title="Adaugă Vehicul B" >
                <Car className="h-4 w-4" /> <span>Vehicul B</span>
              </Button>
              {/* Clear */}
              <Button type="button" size="sm" variant="outline" onClick={clearCanvas} className="ml-auto border-gray-300 text-red-500 hover:bg-red-50" title="Șterge Tot">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Canvas Area */}
            <div className="border rounded-md overflow-hidden bg-gray-50 relative select-none" style={{height: '500px'}}> {/* Increased height */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleInteractionStart}
                onMouseMove={handleInteractionMove}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd} // End interaction if mouse leaves canvas
                onTouchStart={handleInteractionStart}
                onTouchMove={handleInteractionMove}
                onTouchEnd={handleInteractionEnd}
                onTouchCancel={handleInteractionEnd} // End interaction if touch is cancelled
                className="w-full h-full block" // Ensure canvas fills container
                style={{
                  touchAction: "none", // Prevent scrolling/zooming on touch devices
                  cursor: getCursorStyle(), // Dynamic cursor
                  // Background image is drawn onto the canvas, not set via CSS
                }}
              />
               {!isBgLoaded && !backgroundImage && showEditor && (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                       Loading background...
                   </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditor(false)} className="flex-1"> Anulează </Button>
              <Button type="button" onClick={saveSketch} className="flex-1 gap-1 bg-[#0066CC] hover:bg-[#0052a3] text-white"> <Save className="h-4 w-4" /> Salvează Schița </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1"> Înapoi </Button>
        <Button type="submit" className="flex-1 bg-[#0066CC] hover:bg-[#0052a3] text-white" disabled={!sketchImage}> Revizuire Finală </Button>
      </div>
    </form>
  )
}
