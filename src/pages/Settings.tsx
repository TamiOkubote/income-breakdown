import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings as SettingsIcon, Moon, Sun, Palette, Type, Eye, Volume2 } from "lucide-react";
import Header from "@/components/Header";
import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/lib/translations";

interface SettingsData {
  darkMode: boolean;
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: string;
  soundEnabled: boolean;
  language: Language;
}

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, updateLanguage } = useTranslation();
  
  // Check if we should return to investments page
  const getReferrer = () => {
    const from = location.state?.from;
    if (from === '/investments') {
      const savedState = localStorage.getItem('investmentState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return { pathname: '/investments', state: parsed };
      }
    }
    return from || '/';
  };
  
  const referrer = getReferrer();
  const [settings, setSettings] = useState<SettingsData>({
    darkMode: false,
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: 'none',
    soundEnabled: true,
    language: 'en',
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    } else {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        const newSettings = { ...settings, darkMode: true };
        setSettings(newSettings);
        applySettings(newSettings);
      }
    }
  }, []);

  const applySettings = (settingsData: SettingsData) => {
    const root = document.documentElement;
    
    // Apply dark mode
    if (settingsData.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font size
    root.style.fontSize = `${settingsData.fontSize}px`;

    // Apply high contrast
    if (settingsData.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settingsData.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Apply color blind mode
    root.setAttribute('data-color-blind-mode', settingsData.colorBlindMode);
  };

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
    applySettings(newSettings);
    
    // Update language immediately if language setting changes
    if (key === 'language') {
      updateLanguage(value as Language);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setHasChanges(false);
    // Update translation system with saved language
    updateLanguage(settings.language);
    
    // Force re-render of other components by triggering a custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: settings.language } 
    }));
  };

  const resetSettings = () => {
    const defaultSettings: SettingsData = {
      darkMode: false,
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      colorBlindMode: 'none',
      soundEnabled: true,
      language: 'en',
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (typeof referrer === 'object') {
                      navigate(referrer.pathname, { state: referrer.state });
                    } else {
                      navigate(referrer);
                    }
                  }}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('settings.back')}
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <SettingsIcon className="h-8 w-8" />
                {t('settings.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('settings.subtitle')}
              </p>
            </div>
            {hasChanges && (
              <Badge variant="secondary" className="animate-pulse">
                {t('settings.unsavedChanges')}
              </Badge>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Appearance Settings */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  {t('settings.appearance')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      {t('settings.darkMode')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.darkModeDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    {t('settings.fontSize')}: {settings.fontSize}px
                  </Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('settings.fontSizeSmall')}</span>
                    <span>{t('settings.fontSizeLarge')}</span>
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('settings.highContrast')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.highContrastDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>

                {/* Color Blind Support */}
                <div className="space-y-2">
                  <Label>{t('settings.colorBlind')}</Label>
                  <Select 
                    value={settings.colorBlindMode} 
                    onValueChange={(value) => updateSetting('colorBlindMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('settings.colorBlindNone')}</SelectItem>
                      <SelectItem value="protanopia">{t('settings.colorBlindRed')}</SelectItem>
                      <SelectItem value="deuteranopia">{t('settings.colorBlindGreen')}</SelectItem>
                      <SelectItem value="tritanopia">{t('settings.colorBlindBlue')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Settings */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  {t('settings.accessibility')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('settings.reducedMotion')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.reducedMotionDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                  />
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      {t('settings.soundEffects')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.soundEffectsDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label>{t('settings.language')}</Label>
                   <Select 
                    value={settings.language} 
                    onValueChange={(value) => updateSetting('language', value as Language)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview Text */}
                <div className="p-4 rounded-lg border bg-background/50">
                  <h4 className="font-medium mb-2">{t('settings.preview')}</h4>
                  <p className="text-sm">
                    {t('settings.previewText')}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <div className="w-4 h-4 bg-finance-green rounded"></div>
                    <div className="w-4 h-4 bg-expense-red rounded"></div>
                    <div className="w-4 h-4 bg-warning rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex items-center gap-2"
            >
              {t('settings.resetDefaults')}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (typeof referrer === 'object') {
                    navigate(referrer.pathname, { state: referrer.state });
                  } else {
                    navigate(referrer);
                  }
                }}
                disabled={hasChanges}
              >
                {t('settings.cancel')}
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                {t('settings.save')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;