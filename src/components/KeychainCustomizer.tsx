
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Undo2, 
  Redo2, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  Type, 
  Layers,
  Frame,
  Download,
  Plus,
  Minus
} from 'lucide-react';

const KeychainCustomizer = () => {
  // State for all controls
  const [textContent, setTextContent] = useState('');
  const [textHeight, setTextHeight] = useState(5);
  const [lineSpacing, setLineSpacing] = useState(0);
  const [bevelEnabled, setBevelEnabled] = useState(true);
  const [bevelThickness, setBevelThickness] = useState(2.7);
  const [bevelSize, setBevelSize] = useState(3.2);
  const [bevelSegments, setBevelSegments] = useState(2);
  const [curveSegments, setCurveSegments] = useState(8);
  const [baseHeight, setBaseHeight] = useState(2.0);
  const [frameOffset, setFrameOffset] = useState(1.65);
  const [holeClosingFactor, setHoleClosingFactor] = useState(0.3);
  const [ringEnabled, setRingEnabled] = useState(true);
  const [ringXOffset, setRingXOffset] = useState(-2.5);
  const [ringYOffset, setRingYOffset] = useState(3.5);
  const [ringOuterWidth, setRingOuterWidth] = useState(9);
  const [ringOuterHeight, setRingOuterHeight] = useState(8);
  const [ringCornerRadius, setRingCornerRadius] = useState(5.0);
  const [ringHoleEnabled, setRingHoleEnabled] = useState(true);
  const [ringHoleXOffset, setRingHoleXOffset] = useState(-1.2);
  const [ringHoleYOffset, setRingHoleYOffset] = useState(0.0);
  const [ringHoleRadius, setRingHoleRadius] = useState(2.0);
  const [ringHeight, setRingHeight] = useState(2);
  const [isInverse, setIsInverse] = useState(false);
  const [multiMaterialText, setMultiMaterialText] = useState(true);
  const [multiMaterialFrame, setMultiMaterialFrame] = useState(true);
  const [exportFormat, setExportFormat] = useState('stl_binary');
  const [exportFilename, setExportFilename] = useState('keychain_design');
  const [dimensions, setDimensions] = useState('0.0×0.0×0.0');

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    textEditor: true,
    bevelSettings: true,
    advanced: false,
    gapFiller: false,
    frameRing: true,
    general: true,
    printing: false,
    export: true
  });

  // Gap filler state
  const [gapFillers, setGapFillers] = useState([
    {
      id: 0,
      enabled: false,
      xOffset: 0,
      yOffset: 0,
      width: 10,
      height: 10
    }
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textEditorRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addGapFiller = () => {
    const newId = Math.max(...gapFillers.map(f => f.id)) + 1;
    setGapFillers([...gapFillers, {
      id: newId,
      enabled: false,
      xOffset: 0,
      yOffset: 0,
      width: 10,
      height: 10
    }]);
  };

  const removeGapFiller = (id: number) => {
    setGapFillers(gapFillers.filter(f => f.id !== id));
  };

  const updateGapFiller = (id: number, field: string, value: number | boolean) => {
    setGapFillers(gapFillers.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  useEffect(() => {
    // Initialize canvas or 3D rendering here
    // This would contain your original Three.js/WebGL code
    console.log('Initializing 3D canvas...');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Toolbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-800">3D Keychain Customizer</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Pro Edition
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled className="flex items-center space-x-1">
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
              <kbd className="text-xs bg-slate-100 px-1 rounded">Ctrl+Z</kbd>
            </Button>
            <Button variant="outline" size="sm" disabled className="flex items-center space-x-1">
              <Redo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Redo</span>
              <kbd className="text-xs bg-slate-100 px-1 rounded">Ctrl+Y</kbd>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 space-y-4">
            
            {/* Text Editor Section */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.textEditor} onOpenChange={() => toggleSection('textEditor')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-2">
                        <Type className="w-4 h-4 text-blue-600" />
                        <span>Text Editor</span>
                      </div>
                      {openSections.textEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Text Content</Label>
                      <div 
                        ref={textEditorRef}
                        className="min-h-[100px] p-3 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
                        contentEditable
                        onInput={(e) => setTextContent(e.currentTarget.textContent || '')}
                        style={{ outline: 'none' }}
                      >
                        Enter your text here...
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Right-click for styling options</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Custom Font Upload</Label>
                      <Input type="file" accept=".ttf,.otf,.woff,.woff2" multiple className="text-sm" />
                      <p className="text-xs text-slate-500 mt-1">No font loaded. Upload TTF/OTF/WOFF files</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Text Height: {textHeight}mm</Label>
                        <Slider
                          value={[textHeight]}
                          onValueChange={(value) => setTextHeight(value[0])}
                          max={30}
                          min={1}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Line Spacing: {lineSpacing}mm</Label>
                        <Slider
                          value={[lineSpacing]}
                          onValueChange={(value) => setLineSpacing(value[0])}
                          max={20}
                          min={-20}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Bevel Settings */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.bevelSettings} onOpenChange={() => toggleSection('bevelSettings')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-green-600" />
                        <span>Bevel Settings</span>
                      </div>
                      {openSections.bevelSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bevel-enabled" 
                        checked={bevelEnabled} 
                        onCheckedChange={setBevelEnabled}
                      />
                      <Label htmlFor="bevel-enabled" className="text-sm font-medium">Enable Bevels</Label>
                    </div>

                    {bevelEnabled && (
                      <div className="space-y-3 pl-6 border-l-2 border-green-200">
                        <div>
                          <Label className="text-sm font-medium">Bevel Thickness: {bevelThickness}%</Label>
                          <Slider
                            value={[bevelThickness]}
                            onValueChange={(value) => setBevelThickness(value[0])}
                            max={10}
                            min={0}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Bevel Size: {bevelSize}%</Label>
                          <Slider
                            value={[bevelSize]}
                            onValueChange={(value) => setBevelSize(value[0])}
                            max={10}
                            min={0}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Bevel Segments: {bevelSegments}</Label>
                          <Slider
                            value={[bevelSegments]}
                            onValueChange={(value) => setBevelSegments(value[0])}
                            max={5}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Advanced Settings */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.advanced} onOpenChange={() => toggleSection('advanced')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        <span>Advanced</span>
                      </div>
                      {openSections.advanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div>
                      <Label className="text-sm font-medium">Curve Segments (Detail): {curveSegments}</Label>
                      <Slider
                        value={[curveSegments]}
                        onValueChange={(value) => setCurveSegments(value[0])}
                        max={32}
                        min={3}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Gap Filler Section */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.gapFiller} onOpenChange={() => toggleSection('gapFiller')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>Gap Filler Pieces</span>
                      {openSections.gapFiller ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {gapFillers.map((filler, index) => (
                      <div key={filler.id} className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={filler.enabled}
                              onCheckedChange={(checked) => updateGapFiller(filler.id, 'enabled', checked)}
                            />
                            <Label className="text-sm font-medium">Gap Filler #{index + 1}</Label>
                          </div>
                          {gapFillers.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGapFiller(filler.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {filler.enabled && (
                          <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                            <div>
                              <Label className="text-sm">X Offset: {filler.xOffset}mm</Label>
                              <Slider
                                value={[filler.xOffset]}
                                onValueChange={(value) => updateGapFiller(filler.id, 'xOffset', value[0])}
                                max={50}
                                min={-50}
                                step={0.25}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm">Y Offset: {filler.yOffset}mm</Label>
                              <Slider
                                value={[filler.yOffset]}
                                onValueChange={(value) => updateGapFiller(filler.id, 'yOffset', value[0])}
                                max={50}
                                min={-50}
                                step={0.25}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm">Width: {filler.width}mm</Label>
                              <Slider
                                value={[filler.width]}
                                onValueChange={(value) => updateGapFiller(filler.id, 'width', value[0])}
                                max={100}
                                min={0.1}
                                step={0.1}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm">Height: {filler.height}mm</Label>
                              <Slider
                                value={[filler.height]}
                                onValueChange={(value) => updateGapFiller(filler.id, 'height', value[0])}
                                max={100}
                                min={0.1}
                                step={0.1}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addGapFiller}
                      className="w-full flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Filler Piece</span>
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Frame & Ring Section */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.frameRing} onOpenChange={() => toggleSection('frameRing')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-2">
                        <Frame className="w-4 h-4 text-orange-600" />
                        <span>Frame & Ring</span>
                      </div>
                      {openSections.frameRing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Base Height: {baseHeight}mm</Label>
                        <Slider
                          value={[baseHeight]}
                          onValueChange={(value) => setBaseHeight(value[0])}
                          max={20}
                          min={0.1}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Frame Offset: {frameOffset}mm</Label>
                        <Slider
                          value={[frameOffset]}
                          onValueChange={(value) => setFrameOffset(value[0])}
                          max={15}
                          min={0}
                          step={0.05}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Hole Closing Factor: {holeClosingFactor}</Label>
                        <Slider
                          value={[holeClosingFactor]}
                          onValueChange={(value) => setHoleClosingFactor(value[0])}
                          max={5}
                          min={0}
                          step={0.05}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="ring-enabled" 
                          checked={ringEnabled} 
                          onCheckedChange={setRingEnabled}
                        />
                        <Label htmlFor="ring-enabled" className="text-sm font-medium">Enable Ring</Label>
                      </div>

                      {ringEnabled && (
                        <div className="space-y-3 pl-6 border-l-2 border-orange-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Ring X: {ringXOffset}mm</Label>
                              <Slider
                                value={[ringXOffset]}
                                onValueChange={(value) => setRingXOffset(value[0])}
                                max={50}
                                min={-50}
                                step={0.5}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Ring Y: {ringYOffset}mm</Label>
                              <Slider
                                value={[ringYOffset]}
                                onValueChange={(value) => setRingYOffset(value[0])}
                                max={20}
                                min={-20}
                                step={0.5}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Width: {ringOuterWidth}mm</Label>
                              <Slider
                                value={[ringOuterWidth]}
                                onValueChange={(value) => setRingOuterWidth(value[0])}
                                max={50}
                                min={5}
                                step={0.5}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Height: {ringOuterHeight}mm</Label>
                              <Slider
                                value={[ringOuterHeight]}
                                onValueChange={(value) => setRingOuterHeight(value[0])}
                                max={30}
                                min={5}
                                step={0.5}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">Corner Radius: {ringCornerRadius}mm</Label>
                            <Slider
                              value={[ringCornerRadius]}
                              onValueChange={(value) => setRingCornerRadius(value[0])}
                              max={15}
                              min={0}
                              step={0.1}
                              className="mt-1"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="ring-hole-enabled" 
                              checked={ringHoleEnabled} 
                              onCheckedChange={setRingHoleEnabled}
                            />
                            <Label htmlFor="ring-hole-enabled" className="text-sm">Enable Hole</Label>
                          </div>

                          {ringHoleEnabled && (
                            <div className="space-y-2 pl-6 border-l border-slate-200">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">Hole X: {ringHoleXOffset}mm</Label>
                                  <Slider
                                    value={[ringHoleXOffset]}
                                    onValueChange={(value) => setRingHoleXOffset(value[0])}
                                    max={10}
                                    min={-10}
                                    step={0.1}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Hole Y: {ringHoleYOffset}mm</Label>
                                  <Slider
                                    value={[ringHoleYOffset]}
                                    onValueChange={(value) => setRingHoleYOffset(value[0])}
                                    max={10}
                                    min={-10}
                                    step={0.1}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Hole Radius: {ringHoleRadius}mm</Label>
                                <Slider
                                  value={[ringHoleRadius]}
                                  onValueChange={(value) => setRingHoleRadius(value[0])}
                                  max={10}
                                  min={0.5}
                                  step={0.1}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm">Ring Height: {ringHeight}mm</Label>
                            <Slider
                              value={[ringHeight]}
                              onValueChange={(value) => setRingHeight(value[0])}
                              max={20}
                              min={1}
                              step={0.1}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* General Settings */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.general} onOpenChange={() => toggleSection('general')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>General Settings</span>
                      {openSections.general ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div>
                      <Label className="text-sm font-medium">Inverse (Cutout Text)</Label>
                      <Select value={isInverse ? "yes" : "no"} onValueChange={(value) => setIsInverse(value === "yes")}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Printing Options */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.printing} onOpenChange={() => toggleSection('printing')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>Printing Options</span>
                      {openSections.printing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Multi-Material Text</Label>
                      <Select value={multiMaterialText ? "yes" : "no"} onValueChange={(value) => setMultiMaterialText(value === "yes")}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Multi-Material Frame</Label>
                      <Select value={multiMaterialFrame ? "yes" : "no"} onValueChange={(value) => setMultiMaterialFrame(value === "yes")}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Export Section */}
            <Card className="shadow-sm">
              <Collapsible open={openSections.export} onOpenChange={() => toggleSection('export')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-indigo-600" />
                        <span>Export Model</span>
                      </div>
                      {openSections.export ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Export Format</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stl_binary">STL (Binary)</SelectItem>
                          <SelectItem value="stl_ascii">STL (ASCII)</SelectItem>
                          <SelectItem value="obj">OBJ</SelectItem>
                          <SelectItem value="3mf">3MF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Filename</Label>
                      <Input 
                        value={exportFilename} 
                        onChange={(e) => setExportFilename(e.target.value)}
                        placeholder="keychain_design"
                        className="mt-2"
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export 3D File
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 relative bg-slate-50">
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
          />
          
          {/* Dimensions Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-slate-200">
            <div className="text-sm font-medium text-slate-700">
              Dimensions: {dimensions} mm
            </div>
          </div>

          {/* Loading State */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">Loading 3D Preview...</p>
              <p className="text-slate-500 text-sm mt-1">Your keychain will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeychainCustomizer;
