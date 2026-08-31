import { SPEED_OF_LIGHT_KM_S } from "../coordinates/local-group";

/**
 * Standard Cosmological Parameters for Lambda-CDM Concordance Model
 */
export interface CosmologyConfig {
  hubbleConstantKmSPerMpc: number; // H_0 e.g. 70.0 (Planck 67.4, SH0ES 73.0)
  omegaMatter: number; // Omega_m e.g. 0.315 (Dark Matter + Baryonic Matter)
  omegaLambda: number; // Omega_Lambda e.g. 0.685 (Dark Energy)
  omegaRadiation?: number; // Omega_r e.g. ~9.0e-5 (Photons + Relativistic Neutrinos)
  omegaCurvature?: number; // Omega_k = 1 - Omega_m - Omega_Lambda - Omega_r
  speedOfLightKmS?: number; // c = 299,792.458 km/s
}

/**
 * Default Planck 2018 / Consensus Lambda-CDM Parameters
 */
export const DEFAULT_PLANCK_COSMOLOGY: CosmologyConfig = {
  hubbleConstantKmSPerMpc: 70.0,
  omegaMatter: 0.315,
  omegaLambda: 0.685,
  omegaRadiation: 0.0,
  omegaCurvature: 0.0,
  speedOfLightKmS: SPEED_OF_LIGHT_KM_S,
};

export interface ComprehensiveCosmologicalDistances {
  redshiftZ: number;
  scaleFactorA: number; // a = 1 / (1 + z)
  hubbleDistanceMpc: number; // D_H = c / H_0 (~4283 Mpc for H_0 = 70)
  comovingDistanceMpc: number; // D_C(z) = D_H * int_0^z dz'/E(z')
  transverseComovingDistanceMpc: number; // D_M(z)
  luminosityDistanceMpc: number; // D_L(z) = (1 + z) * D_M(z)
  angularDiameterDistanceMpc: number; // D_A(z) = D_M(z) / (1 + z)
  lookbackTimeGyr: number; // t_L(z) = t_H * int_0^z dz' / ((1+z') * E(z'))
  lookbackTimeYears: number;
  cosmicAgeGyr: number; // t_age(z) = t_0 - t_L(z)
  cosmicAgeYears: number;
  universeAgeGyr: number; // t_0
  apparentRecessionVelocityKmS: number; // v = c * z
  hubbleLinearDistanceMpc: number; // d_linear = (c * z) / H_0
  linearApproximationErrorPercent: number;
  isLocalGroupBound: boolean;
  scientificNotes: string;
}

/**
 * Cosmological Distance & Spacetime Engine
 *
 * Implements rigorous numerical quadrature of Friedmann-Lemaitre-Robertson-Walker (FLRW)
 * spacetime metric in a Lambda-CDM Universe.
 */
export class CosmologyCalculator {
  private readonly config: Required<CosmologyConfig>;
  private readonly hubbleDistanceMpc: number;
  private readonly hubbleTimeGyr: number;
  private readonly universeAgeGyr: number;

  constructor(config: Partial<CosmologyConfig> = {}) {
    const h0 = config.hubbleConstantKmSPerMpc ?? DEFAULT_PLANCK_COSMOLOGY.hubbleConstantKmSPerMpc;
    const om = config.omegaMatter ?? DEFAULT_PLANCK_COSMOLOGY.omegaMatter;
    const ol = config.omegaLambda ?? DEFAULT_PLANCK_COSMOLOGY.omegaLambda;
    const or = config.omegaRadiation ?? 0.0;
    const ok = config.omegaCurvature ?? 1.0 - om - ol - or;
    const c = config.speedOfLightKmS ?? SPEED_OF_LIGHT_KM_S;

    this.config = {
      hubbleConstantKmSPerMpc: h0,
      omegaMatter: om,
      omegaLambda: ol,
      omegaRadiation: or,
      omegaCurvature: ok,
      speedOfLightKmS: c,
    };

    // D_H = c / H_0
    this.hubbleDistanceMpc = c / h0;

    // t_H = 1 / H_0 in Gyr: 1 km/s/Mpc = 1.0227e-3 Gyr^-1
    // t_H (Gyr) = 977.79222 / H_0
    this.hubbleTimeGyr = 977.79222 / h0;

    // Compute present universe age t_0 dynamically via FLRW integral
    this.universeAgeGyr = this.computeUniverseAgeGyr();
  }

  public getConfig(): Readonly<Required<CosmologyConfig>> {
    return this.config;
  }

  /**
   * Dimensionless Hubble parameter E(z):
   * E(z) = sqrt(Omega_m * (1+z)^3 + Omega_r * (1+z)^4 + Omega_k * (1+z)^2 + Omega_Lambda)
   */
  public getEz(z: number): number {
    const onePlusZ = 1.0 + z;
    const termM = this.config.omegaMatter * Math.pow(onePlusZ, 3);
    const termR = this.config.omegaRadiation * Math.pow(onePlusZ, 4);
    const termK = this.config.omegaCurvature * Math.pow(onePlusZ, 2);
    const termL = this.config.omegaLambda;

    return Math.sqrt(termM + termR + termK + termL);
  }

  /**
   * Numerical integration using Simpson's 3/8 Rule
   */
  private integrate(
    func: (z: number) => number,
    a: number,
    b: number,
    steps: number = 200
  ): number {
    if (a === b) return 0;
    const n = Math.max(steps, 20);
    const h = (b - a) / n;
    let sum = func(a) + func(b);

    for (let i = 1; i < n; i++) {
      const z = a + i * h;
      sum += i % 2 === 0 ? 2 * func(z) : 4 * func(z);
    }

    return (sum * h) / 3.0;
  }

  /**
   * Calculates the present-day age of the Universe t_0 (in Gyr)
   * t_0 = t_H * int_0^1 du / (u * E((1-u)/u)) where u = 1 / (1+z)
   */
  private computeUniverseAgeGyr(): number {
    // Integrate u from 1e-5 (near Big Bang z ~ 100,000) to 1.0 (z = 0)
    const integral = this.integrate(
      (u) => {
        if (u <= 0) return 0;
        const z = (1.0 - u) / u;
        const ez = this.getEz(z);
        return 1.0 / (u * ez);
      },
      1e-5,
      1.0,
      400
    );

    return this.hubbleTimeGyr * integral;
  }

  /**
   * Returns the calculated present-day age of the Universe (in Gyr).
   */
  public calculateUniverseAgeGyr(): number {
    return this.universeAgeGyr;
  }

  /**
   * Line-of-sight Comoving Distance D_C(z):
   * D_C = D_H * int_0^z (1 / E(z')) dz'
   * Evaluated via logarithmic transform t = ln(1+z') for high numerical stability across all z.
   */
  public calculateComovingDistanceMpc(z: number): number {
    if (z <= 0) return 0;

    const maxT = Math.log(1.0 + z);
    const steps = 300;

    const integral = this.integrate(
      (t) => {
        const expT = Math.exp(t);
        const zPrime = expT - 1.0;
        return expT / this.getEz(zPrime);
      },
      0,
      maxT,
      steps
    );

    return this.hubbleDistanceMpc * integral;
  }

  /**
   * Transverse Comoving Distance D_M(z):
   * D_M = D_C for flat space (Omega_k = 0)
   */
  public calculateTransverseComovingDistanceMpc(z: number): number {
    const dc = this.calculateComovingDistanceMpc(z);
    const ok = this.config.omegaCurvature;

    if (Math.abs(ok) < 1e-6) {
      return dc;
    }

    const sqrtOk = Math.sqrt(Math.abs(ok));
    if (ok > 0) {
      // Open Universe
      return (this.hubbleDistanceMpc / sqrtOk) * Math.sinh((sqrtOk * dc) / this.hubbleDistanceMpc);
    } else {
      // Closed Universe
      return (this.hubbleDistanceMpc / sqrtOk) * Math.sin((sqrtOk * dc) / this.hubbleDistanceMpc);
    }
  }

  /**
   * Luminosity Distance D_L(z) = (1 + z) * D_M(z)
   */
  public calculateLuminosityDistanceMpc(z: number): number {
    if (z <= 0) return 0;
    const dm = this.calculateTransverseComovingDistanceMpc(z);
    return (1.0 + z) * dm;
  }

  /**
   * Angular Diameter Distance D_A(z) = D_M(z) / (1 + z)
   */
  public calculateAngularDiameterDistanceMpc(z: number): number {
    if (z <= 0) return 0;
    const dm = this.calculateTransverseComovingDistanceMpc(z);
    return dm / (1.0 + z);
  }

  /**
   * Lookback Time t_L(z):
   * t_L = t_H * int_0^z dz' / ((1 + z') * E(z'))
   */
  public calculateLookbackTimeGyr(z: number): number {
    if (z <= 0) return 0;
    const maxT = Math.log(1.0 + z);
    const steps = 300;

    const integral = this.integrate(
      (t) => {
        const zPrime = Math.exp(t) - 1.0;
        return 1.0 / this.getEz(zPrime);
      },
      0,
      maxT,
      steps
    );
    return Math.min(this.universeAgeGyr, this.hubbleTimeGyr * integral);
  }

  /**
   * Cosmic Age of the Universe at redshift z:
   * t_age(z) = t_0 - t_L(z)
   */
  public calculateCosmicAgeGyr(z: number): number {
    if (z <= 0) return this.universeAgeGyr;
    const lookbackGyr = this.calculateLookbackTimeGyr(z);
    return Math.max(0, this.universeAgeGyr - lookbackGyr);
  }

  /**
   * Scale Factor a(z) = 1 / (1 + z)
   */
  public redshiftToScaleFactor(z: number): number {
    if (z < 0) return 1.0;
    return 1.0 / (1.0 + z);
  }

  /**
   * Scale Factor to Redshift: z(a) = 1 / a - 1
   */
  public scaleFactorToRedshift(a: number): number {
    if (a <= 0) return 1e6; // Near singularity
    if (a >= 1.0) return 0.0;
    return 1.0 / a - 1.0;
  }

  /**
   * Inverted root-finding: Finds redshift z corresponding to a given cosmic age (in Gyr).
   * Monotonic bisection search with quadratic interpolation.
   */
  public cosmicAgeToRedshift(targetAgeGyr: number): number {
    if (targetAgeGyr >= this.universeAgeGyr) return 0.0;
    if (targetAgeGyr <= 0.0001) return 1100.0; // Near recombination / early universe

    let lowZ = 0.0;
    let highZ = 1500.0;

    for (let i = 0; i < 40; i++) {
      const midZ = (lowZ + highZ) / 2.0;
      const ageAtMid = this.calculateCosmicAgeGyr(midZ);

      if (Math.abs(ageAtMid - targetAgeGyr) < 0.0001) {
        return midZ;
      }

      if (ageAtMid > targetAgeGyr) {
        // We need an earlier age (higher redshift)
        lowZ = midZ;
      } else {
        // We need a later age (lower redshift)
        highZ = midZ;
      }
    }

    return (lowZ + highZ) / 2.0;
  }

  /**
   * Converts angular size (in arcminutes) to physical transverse diameter (in kpc) at redshift z:
   * d_kpc = theta_rad * D_A * 1000
   */
  public angularSizeToPhysicalDiameterKpc(angularSizeArcmin: number, z: number): number {
    const daMpc = this.calculateAngularDiameterDistanceMpc(z);
    const thetaRad = (angularSizeArcmin / 60.0) * (Math.PI / 180.0);
    return thetaRad * daMpc * 1000.0;
  }

  /**
   * Calculates comprehensive cosmological parameters for a given redshift z.
   */
  public calculateAll(z: number): ComprehensiveCosmologicalDistances {
    const isLocalGroupBound = z <= 0.001;
    const apparentRecessionVelocityKmS = this.config.speedOfLightKmS * z;
    const hubbleLinearDistanceMpc =
      z > 0 ? apparentRecessionVelocityKmS / this.config.hubbleConstantKmSPerMpc : 0;
    const scaleFactorA = this.redshiftToScaleFactor(z);

    if (isLocalGroupBound) {
      return {
        redshiftZ: z,
        scaleFactorA: 1.0,
        hubbleDistanceMpc: this.hubbleDistanceMpc,
        comovingDistanceMpc: 0,
        transverseComovingDistanceMpc: 0,
        luminosityDistanceMpc: 0,
        angularDiameterDistanceMpc: 0,
        lookbackTimeGyr: 0,
        lookbackTimeYears: 0,
        cosmicAgeGyr: this.universeAgeGyr,
        cosmicAgeYears: this.universeAgeGyr * 1e9,
        universeAgeGyr: this.universeAgeGyr,
        apparentRecessionVelocityKmS,
        hubbleLinearDistanceMpc: 0,
        linearApproximationErrorPercent: 0,
        isLocalGroupBound: true,
        scientificNotes:
          "Gravitationally bound Local Group regime (z <= 0.001): observed Doppler shifts are dominated by orbital peculiar velocities rather than cosmological expansion.",
      };
    }

    const comovingDistanceMpc = this.calculateComovingDistanceMpc(z);
    const transverseComovingDistanceMpc = this.calculateTransverseComovingDistanceMpc(z);
    const luminosityDistanceMpc = this.calculateLuminosityDistanceMpc(z);
    const angularDiameterDistanceMpc = this.calculateAngularDiameterDistanceMpc(z);
    const lookbackTimeGyr = this.calculateLookbackTimeGyr(z);
    const lookbackTimeYears = lookbackTimeGyr * 1e9;
    const cosmicAgeGyr = this.calculateCosmicAgeGyr(z);
    const cosmicAgeYears = cosmicAgeGyr * 1e9;

    const linearApproximationErrorPercent =
      (Math.abs(hubbleLinearDistanceMpc - comovingDistanceMpc) / comovingDistanceMpc) * 100.0;

    return {
      redshiftZ: z,
      scaleFactorA,
      hubbleDistanceMpc: this.hubbleDistanceMpc,
      comovingDistanceMpc,
      transverseComovingDistanceMpc,
      luminosityDistanceMpc,
      angularDiameterDistanceMpc,
      lookbackTimeGyr,
      lookbackTimeYears,
      cosmicAgeGyr,
      cosmicAgeYears,
      universeAgeGyr: this.universeAgeGyr,
      apparentRecessionVelocityKmS,
      hubbleLinearDistanceMpc,
      linearApproximationErrorPercent,
      isLocalGroupBound: false,
      scientificNotes: `FLRW integration (H_0 = ${this.config.hubbleConstantKmSPerMpc}, Omega_m = ${this.config.omegaMatter}, Omega_Lambda = ${this.config.omegaLambda}). Universe Age t_0 = ${this.universeAgeGyr.toFixed(2)} Gyr. Linear Hubble deviation: ${linearApproximationErrorPercent.toFixed(2)}%.`,
    };
  }

  /**
   * Decomposes observed velocity into cosmic expansion and peculiar velocity:
   * v_obs = H_0 * d_true + v_pec  =>  v_pec = v_obs - H_0 * d_true
   */
  public calculatePeculiarVelocity(
    observedRadialVelocityKmS: number,
    trueDistanceMpc: number
  ): {
    cosmicHubbleVelocityKmS: number;
    peculiarVelocityKmS: number;
    isInfalling: boolean;
  } {
    const cosmicHubbleVelocityKmS = this.config.hubbleConstantKmSPerMpc * trueDistanceMpc;
    const peculiarVelocityKmS = observedRadialVelocityKmS - cosmicHubbleVelocityKmS;

    return {
      cosmicHubbleVelocityKmS,
      peculiarVelocityKmS,
      isInfalling: peculiarVelocityKmS < 0,
    };
  }

  /**
   * Particle Horizon (Comoving Radius of the Observable Universe):
   * Maximum comoving distance from which photons could reach us since t = 0:
   * chi_p = D_H * int_0^infinity dz' / E(z')
   * In Planck 2018 Lambda-CDM, chi_p approx 14,250 - 14,460 Mpc (~46.5 - 47.1 Billion light-years).
   */
  public calculateParticleHorizonComovingMpc(): number {
    const dcAtDecoupling = this.calculateComovingDistanceMpc(1089.0);
    // Analytic remainder for matter-dominated era from z = 1089 to infinity:
    // int_z_rec^inf dz / sqrt(Omega_m * (1+z)^3) = 2 / sqrt(Omega_m * (1 + z_rec))
    const remainder = (2.0 / Math.sqrt(this.config.omegaMatter * 1090.0)) * this.hubbleDistanceMpc;
    return dcAtDecoupling + remainder;
  }

  /**
   * Particle Horizon in Billion Light-Years (Gly):
   * 1 Mpc = 3.261563777e-3 Gly
   */
  public calculateParticleHorizonGly(): number {
    return this.calculateParticleHorizonComovingMpc() * 0.003261563777;
  }

  /**
   * Hubble Radius (Hubble Sphere / Horizon) R_H = c / H_0:
   * Distance at which the recession velocity equals the speed of light (v = c).
   */
  public calculateHubbleRadiusMpc(): number {
    return this.hubbleDistanceMpc;
  }

  /**
   * Hubble Radius in Billion Light-Years (Gly):
   */
  public calculateHubbleRadiusGly(): number {
    return this.hubbleDistanceMpc * 0.003261563777;
  }

  /**
   * Cosmological Event Horizon (Comoving):
   * Maximum comoving distance from which a light signal emitted NOW (t=t_0, z=0)
   * can ever reach us in the infinite future (t -> infinity).
   * chi_e = D_H * int_0^1 dw / sqrt(Omega_m * w^3 + Omega_Lambda) where w = 1/a
   * In Lambda-CDM, chi_e approx 5,190 Mpc (~16.9 Billion light-years).
   */
  public calculateEventHorizonComovingMpc(): number {
    const integral = this.integrate(
      (w) => {
        const ezTerm = Math.sqrt(
          this.config.omegaMatter * Math.pow(w, 3) +
            this.config.omegaRadiation * Math.pow(w, 4) +
            this.config.omegaCurvature * Math.pow(w, 2) +
            this.config.omegaLambda
        );
        return 1.0 / ezTerm;
      },
      0.0,
      1.0,
      300
    );

    return this.hubbleDistanceMpc * integral;
  }

  /**
   * Comoving Distance to the CMB Last-Scattering Surface (z ~ 1089.0):
   */
  public calculateCMBComovingDistanceMpc(): number {
    return this.calculateComovingDistanceMpc(1089.0);
  }

  /**
   * Inverted root-finding: Converts comoving distance (in Mpc) to cosmological redshift z.
   */
  public comovingDistanceToRedshift(targetDistanceMpc: number): number {
    if (targetDistanceMpc <= 0) return 0;
    const particleHorizonMpc = this.calculateParticleHorizonComovingMpc();
    if (targetDistanceMpc >= particleHorizonMpc) return 1500.0;

    let lowZ = 0.0;
    let highZ = 1500.0;

    for (let i = 0; i < 50; i++) {
      const midZ = (lowZ + highZ) / 2.0;
      const distAtMid = this.calculateComovingDistanceMpc(midZ);

      if (Math.abs(distAtMid - targetDistanceMpc) < 0.01) {
        return midZ;
      }

      if (distAtMid < targetDistanceMpc) {
        lowZ = midZ;
      } else {
        highZ = midZ;
      }
    }

    return (lowZ + highZ) / 2.0;
  }

  /**
   * Proper distance of an emitter at the time the light was emitted:
   * D_proper(t_emit) = a(z) * D_C(z) = D_A(z)
   */
  public properDistanceAtEmissionMpc(z: number): number {
    return this.calculateAngularDiameterDistanceMpc(z);
  }

  /**
   * Temperature of the CMB photon bath at redshift z:
   * T(z) = T_0 * (1 + z)
   * T_0 = 2.7255 K (Fixsen 2009)
   */
  public calculateCMBTemperatureK(z: number, t0: number = 2.7255): number {
    return t0 * (1.0 + Math.max(0, z));
  }
}

// Global default instance using Planck baseline parameters
export const defaultCosmology = new CosmologyCalculator();

// Pure functional helpers using default or custom cosmology instance
export function redshiftToScaleFactor(z: number): number {
  return defaultCosmology.redshiftToScaleFactor(z);
}

export function scaleFactorToRedshift(a: number): number {
  return defaultCosmology.scaleFactorToRedshift(a);
}

export function redshiftToCosmicAge(
  z: number,
  calculator: CosmologyCalculator = defaultCosmology
): number {
  return calculator.calculateCosmicAgeGyr(z);
}

export function redshiftToLookbackTime(
  z: number,
  calculator: CosmologyCalculator = defaultCosmology
): number {
  return calculator.calculateLookbackTimeGyr(z);
}

export function cosmicAgeToRedshift(
  ageGyr: number,
  calculator: CosmologyCalculator = defaultCosmology
): number {
  return calculator.cosmicAgeToRedshift(ageGyr);
}

export function scaleFactorToCosmicAge(
  a: number,
  calculator: CosmologyCalculator = defaultCosmology
): number {
  const z = calculator.scaleFactorToRedshift(a);
  return calculator.calculateCosmicAgeGyr(z);
}

export function comovingDistanceToRedshift(
  distanceMpc: number,
  calculator: CosmologyCalculator = defaultCosmology
): number {
  return calculator.comovingDistanceToRedshift(distanceMpc);
}

export function calculateParticleHorizonGly(
  calculator: CosmologyCalculator = defaultCosmology
): number {
  return calculator.calculateParticleHorizonGly();
}

export function calculateHubbleRadiusGly(
  calculator: CosmologyCalculator = defaultCosmology
): number {
  return calculator.calculateHubbleRadiusGly();
}
